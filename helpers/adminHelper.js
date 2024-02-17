const Order = require('../models/order')

function bestSelling() {

    try {

         return new Promise( async (resolve, reject) => {
             const bestSellingTopTen = await Order.aggregate([
                 {
                   $lookup: {
                     from: 'products',
                     localField: 'products.productId',
                     foreignField: '_id',
                     as: 'products',
                   },
                 },
                 {
                   $unwind: '$products',
                 },
                 {
                     $match: {
                       status: 'placed'
                     },
                   },
                  
                   {
                     $group: {
                       _id: { category: `$products._id` },
                       count: { $sum: 1 },
                       data: { $first: '$$ROOT'}
                     },
                   },
                   {
                     $sort: { count: -1 },
                   },
                   {
                     $limit: 10,
                   },
               ]);
               
               if(!bestSellingTopTen) reject(new Error(`data did'nt recived`));
                resolve(bestSellingTopTen)
         })
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    bestSelling,
}