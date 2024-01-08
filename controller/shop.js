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