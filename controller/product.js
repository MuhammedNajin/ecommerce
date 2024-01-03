
const Product = require('../models/product');
const Catagery = require('../models/cetagory');
const path = require('node:path');
const sharp = require('sharp');





// add product 

module.exports.addproduct = async (req, res) => {
    try {

        const cetagory = await Catagery.findOne({name: req.body.cetagory});
           const images = []

           // pushing images to array 
          for(let i = 0; i < req.files.length; i++) {
              
            images.push(req.files[i].filename);

             const selectedPath = path.resolve(__dirname, '..', 'public', 'img', 'productImage', 'sharp', `${req.files[i].filename}`);

             await sharp(req.files[i].path).resize(500, 500).toFile(selectedPath);

          }

          const sizes = []
          for(let i = 0; i < req.body.size.length; i++) {
            sizes.push(req.body.size[i]);
          }
          console.log(images,);
          console.log(sizes);

        const variant = {
            price: req.body.price,
            offerPrice: req.body.offer,
            color: req.body.color,
            size: sizes,
            images: images,
            stock: req.body.stock,
        }

         const product = new Product({
            name: req.body.pname,
            description: req.body.description,
            cetagory: cetagory._id,
            variant: variant
         })

        const isSave = await product.save();

         if(isSave) {
            res.redirect('/admin/addProduct');
         }
        
    } catch (error) {
        console.log(error);
    }
}




module.exports.listProduct = async (req, res) => {
    try {
        const id = req.body.id;
        return Product.findOne({_id: id})
        .then((product) => {
            if(product.isListed) {
                return Product.updateOne({_id: id}, {
                    $set: {
                        isListed: false
                    }
                })


            } else {

                return Product.updateOne({_id: id}, {
                    $set: {
                        isListed: true
                    }
                })

            }
        })
        .then(() => {
            res.json({listed: true});
        })
        .catch((err) =>{
            console.log(err);
        })

    
        
    } catch (error) {
        console.log(error);
    }
}