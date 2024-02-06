const Catagery = require('../models/cetagory');
const Product = require('../models/product');

module.exports.loadShop = async (req, res) => {
    try {
        const cetagory = await Catagery.find({isListed: true});
        const product = await Product.find({isListed: true, }).populate('cetagory');
        const brand = await Product.find({}, { brand: 1 });

        console.log(product);
        console.log(brand, brand);
        res.render('shop', { cetagory: cetagory, product: product, brand: brand });
    } catch (error) {
        console.log(error);
    }
}



///// search filter sort /////////


module.exports.filter = async (req, res) => {
    try {
         const search = req.body.search ? req.body.search : "";
         const sort = req.body.sort === 'increacing' ? 1 : -1;
         const cetagory = req.body.cetagory ? req.body.cetagory : false;
         const brand = req.body.brand ? req.body.brand : false;
         const price = req.body.price ? req.body.price.split('-') : false;
         
         const products = await Product.find({
            name: {$regex: search, $options: 'i'},
        }).sort({"variant.0.price": sort}).populate('cetagory')
        console.log(products);
        if(products) {
            if( cetagory || brand || price ) {

            let product = [];

              if(cetagory) {

                const result = products.filter((el, i) =>  el.cetagory.name == cetagory);
                product.push(...result);
              }

              if(brand) {
                const array = cetagory ? product : products
                const result = array.filter((el, i) => el.brand == brand);
                res.status(200).json({pass: true, product: result});
              } 

              if(price){
                const array = cetagory ? product : products
                const result = array.filter((el, i) => ( el.variant[0].offerPrice >= parseInt(price[0]) && el.variant[0].offerPrice <= parseInt(price[1])));
                res.status(200).json({pass: true, product: result});
              }
                res.status(200).json({pass: true, product: product});
            } else {
                res.status(200).json({pass: true, product: products})

            }
        }
    } catch (error) {
        console.log(error);
    }
}