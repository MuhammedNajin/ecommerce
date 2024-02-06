const Catagery = require('../models/cetagory');
const Product = require('../models/product');

module.exports.loadShop = async (req, res) => {
    try {
        const cetagory = await Catagery.find({isListed: true});
        const product = await Product.find({isListed: true, }).populate('cetagory');

        console.log(product)
        res.render('shop', {cetagory: cetagory, product: product});
    } catch (error) {
        console.log(error);
    }
}



///// search filter sort /////////


module.exports.filter = async (req, res) => {
    try {
        console.log('hello')
       
        
         const search = req.body.search ? req.body.search : "";
         const sort = req.body.sort === 'increacing' ? 1 : -1;
         const cetagory = req.body.cetagory ? req.body.cetagory : [];

        const products = await Product.find({
            name: {$regex: search, $options: 'i'},
        }).sort({"variant.0.price": sort})
        console.log(products);
        if(products) {
            if(cetagory) {
                const product = products.filter((el, i) => el.cetagory.name === cetagory);
                 res.status(200).json({pass: true, product: product})

            } else {
                res.status(200).json({pass: true, product: products})

            }
        }
    } catch (error) {
        console.log(error);
    }
}