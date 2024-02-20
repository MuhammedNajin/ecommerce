
const Product = require('../models/product');
const Catagery = require('../models/cetagory');
const path = require('node:path');
const sharp = require('sharp');
const Review = require('../models/reviewModal');







// add product 

module.exports.addproduct = async (req, res) => {
    try {

        const cetagory = await Catagery.findOne({ name: req.body.cetagory });
        const images = []

        // pushing images to array 
        for (let i = 0; i < req.files.length; i++) {

            images.push(req.files[i].filename);

            const selectedPath = path.resolve(__dirname, '..', 'public', 'img', 'productImage', 'sharp', `${req.files[i].filename}`);

            await sharp(req.files[i].path).resize(500, 500).toFile(selectedPath);

        }

        const sizes = []
        for (let i = 0; i < req.body.size.length; i++) {
            sizes.push(req.body.size[i]);
        }
        console.log(images,);
        console.log(sizes);
        const price = parseInt(req.body.price);
        const offerPrice = parseInt(req.body.offer);
        const stock = parseInt(req.body.stock);
        const variant = {
            price: price ,
            offerPrice: offerPrice,
            color: req.body.color,
            size: sizes,
            images: images,
            stock: stock,
        }

        const product = new Product({
            name: req.body.pname,
            description: req.body.description,
            cetagory: cetagory._id,
            brand: req.body.brand,
            variant: variant
        })

        const isSave = await product.save();

        if (isSave) {
            res.redirect('/admin/addProduct');
        }

    } catch (error) {
        console.log(error);
    }
}



// list and unlist the product
module.exports.listProduct = async (req, res) => {
    try {
        const id = req.body.id;
        return Product.findOne({ _id: id })
            .then((product) => {
                if (product.isListed) {
                    return Product.updateOne({ _id: id }, {
                        $set: {
                            isListed: false
                        }
                    })


                } else {

                    return Product.updateOne({ _id: id }, {
                        $set: {
                            isListed: true
                        }
                    })

                }
            })
            .then(() => {
                res.json({ listed: true });
            })
            .catch((err) => {
                console.log(err);
            })



    } catch (error) {
        console.log(error);
    }
}


// load variant page

module.exports.loadVariant = async (req, res) => {

    try {

        const id = req.params.id;
        if (id) {
            const product = await Product.findOne({ _id: id }, { name: 1, variant: 1 });
            console.log(product.variant[0].images[0])

            if (product) {
                res.render('variantManagement', { product: product });
            } else {
                console.log('product not found');
            }
        } else {
            console.log('id not recieved')
        }

    } catch (error) {

        console.log(error);
    }
}


module.exports.addVariant = async (req, res) => {
    try {
        const id = req.body.id;
        const size = req.body.size;

        if (id) {
            const sizes = []
            for (let i = 0; i < size.length; i++) {
                sizes.push(size[i]);
            }

            const images = [];
            for (let i = 0; i < req.files.length; i++) {
                images.push(req.files[i].filename);

                const dirPath = path.resolve(__dirname, '..', 'public', 'img', 'productImage', 'sharp', `${req.files[i].filename}`);

                await sharp(req.files[i].path).resize(500, 500).toFile(dirPath);

            }
            console.log('offer', req.body.offerPrice)
            console.log(images, sizes)
            const price = parseInt(req.body.price);
            const offerPrice = parseInt(req.body.offerPrice);
            const stock = parseInt(req.body.stock);
             console.log(stock, price, offerPrice)
            const variant = {
                price: price,
                offerPrice: offerPrice,
                color: req.body.color,
                size: sizes,
                images: images,
                stock: stock,

            }

            return Product.updateOne({ _id: id }, {
                $push: { variant: variant }
            })
                .then((data) => {
                    if (data) {
                        res.redirect(`/admin/loadVariant/${id}`);
                    }
                })
        } else {
            console.log('id did not recived');
        }

    } catch (error) {
        console.log(error);
    }
}


module.exports.LoadeditVariant = async (req, res) => {
    try {
        const index = req.query.index;
        const id = req.query.id;
        console.log(id)
        console.log(index)
        if(id) {
            return Product.findOne({ _id: id },)
                .then((data) => {
                    console.log(data);
                    const product = data.variant[index];
                    const id = data._id;
                    console.log(product);
                    res.render('editVariant', { product: product, id: id, index: index, data });
                })
                .catch((err) => console.log(err));
        } else {
            console.log('id not recieved in load variant');
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports.editVariant = async (req, res) => {
    try {
        console.log('recccccccccccccccc')
        const id = req.body.id
        const name = req.body.name;
        const description = req.body.description;
        const index = req.body.index;
       if(name) await Product.updateOne({ _id: id }, { $set: { name: name }});
       if(description) await Product.updateOne({ _id: id }, { $set: { description: description }});
       

        const newImage = [];
         const product = await Product.findById({_id: id})
         const images = product.variant[index].images;
         console.log(images, 'heloo')
         console.log(req.files, 'files')
        for (let i = 0; i < 4 ; i++) {
            const image = req.files[i]?.filename || images[i]
            console.log(image, 'refddddddddddddddddddddddddd')
            newImage.push(image);
           if(req.files[i]) {
            const dirPath = path.resolve(__dirname, '..', 'public', 'img', 'productImage', 'sharp', `${image}`);
            await sharp(req.files[i].path).resize(500, 500).toFile(dirPath);
           }
        }
         console.log(newImage, 'helllssjsjjsjsjsjsjsjsjjs')
        const price = parseInt(req.body.price);
        const offerPrice = parseInt(req.body.offer);
        const stock = parseInt(req.body.stock);
        return Product.findOne({ _id: id }, { variant: 1 })
            .then(() => {
                return Product.updateOne({ _id: id }, {
                    $set: {
                        [`variant.${index}.price`]: price,
                        [`variant.${index}.offerPrice`]: offerPrice,
                        [`variant.${index}.color`]: req.body.color,
                        [`variant.${index}.size`]: req.body.size,
                        [`variant.${index}.images`]: newImage,
                        [`variant.${index}.stock`]: stock,
                    }
                })
            })
            .then(() => {
                res.redirect(`/admin/edit-variant?index=${index}&id=${id}`);
            })
            .catch((err) => {
                console.log(err, 'errr');
            })
    } catch (error) {
        console.log(error)
    }
}


// product detiles

module.exports.productdetiles = async (req, res) => {
    try {
        const {id, index} = req.query;
        console.log(id, index);
        
        const product = await Product.findOne({_id: id})
            if(req.xhr) {
                console.log('ajax')
                res.json({product: product, index: index});
            } else {
                let totalRating = 0;
                const review = await Review.find({ productId: id });
                if(review) {
                    const sumOfRating = review.reduce((acc, crr) => acc += crr.rating, 0)
                    totalRating = sumOfRating / review.length;
                    console.log('helloo', totalRating, sumOfRating, review.length)
                }
                 
                res.render('productDetails', {product: product, index: index, review: review, image: product.variant[index].images[0], totalRating });
            }

    } catch (error) {
        console.log(error);
    }
}



