const Order = require('../models/order')

function bestSelling(item) {

    try {

        if(!item || typeof item != 'string') {
            return new Error('argument must be string')
         } else {
             const type = ['brand', 'cetagory', 'name'];
             let flag = false
             for(let i = 0; i < 3; i++) {
                 if(item === type[i]) {
                     flag = true
                 }
             }
     
            if(flag === true ) new Error('incorrect field name')
         }
     
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
                       _id: { category: `$products.${item}` },
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