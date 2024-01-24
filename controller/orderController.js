
const Address = require('../models/address');
const Cart = require('../models/cartModel');
const order = require('../models/order');
const Order = require('../models/order');
const Product = require('../models/product');

module.exports.addAddress = async (req, res) => {
    try {
        console.log(req.body);
        const userid = req.session.user?._id;

        if (userid) {
            const fullname = req.body.fname + " " + req.body.lname;

            const userAddress = {
                fullName: fullname,
                country: req.body.country,
                address: req.body.address,
                state: req.body.state,
                city: req.body.city,
                pincode: req.body.pin,
                phone: req.body.phone,
                email: req.body.email
            }


            const ad = await Address.findOne({ user: userid });

            if (ad) {
                await Address.updateOne({ user: userid }, {
                    $push: {
                        address: userAddress
                    }
                })
            } else {

                const address = new Address({
                    user: userid,
                    address: userAddress
                })

                await address.save();

            }


            res.redirect('/check-out');

        } else {
            console.log('id didt recived');
        }







    } catch (error) {
        console.log(error)
    }
}


module.exports.placeOrder = async (req, res) => {
    try {

        console.log(req.body);
        const userId = req.session.user?._id;
        const { index, payment_method, subtotal } = req.body
        
        const cart = await Cart.findOne({ user: userId }).populate( 'products.productId' );
        const products = cart.products;
        const addresses = await Address.findOne({ user: userId }, { "address": 1});
        const status = payment_method === 'COD' ? 'placed' : 'pending';
       
        const selectedAddress = addresses.address[index];
        const date = new Date();
        const delivery = new Date(date.getTime() + 10 * 24 * 60 * 60 * 1000);
        const deliveryDate = delivery.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }).replace(/\//g, '-');
        

        const order = new Order({
            user: userId,
            deliveryDetails: selectedAddress,
            products: products,
            totalAmount: subtotal,
            date: date,
            expected_delivery: deliveryDate,
            status: status,
            paymentMethod: payment_method,
        })
       
       
          const order_details =  await order.save()
          const oderId = order_details._id;

          if(order_details.status === 'placed') {
            
            await Cart.deleteOne({user: userId});

            for(let i = 0; i < cart.products.length; i++) {
                {
                    const productId = products[i].productId;
                const index = products[i].product;
                const productQuantity = products[i].quantity;
                console.log(typeof productQuantity, productQuantity)
                await Product.updateOne({_id: productId}, {
                    $inc: {
                        [`variant.${index}.stock`]: - productQuantity
                    }
                })

                }
                
            }

                res.json({success: true});
          }
        



    } catch (error) {
        console.log(error)
    }
}

module.exports.loadOrderSucces = (req, res) => {
    try {
        res.render('orderSucces');
    } catch (error) {
        console.log(error)
    }
}

module.exports.loadMyOrder =  async (req, res) => {
    try {
        const userid = req.session.user?._id;
        console.log(typeof userid , userid);
        const order = await Order.find({user: userid}).populate('user').populate('products.productId');
        console.log(order)
        res.render('orderDetails', { myOrder: order });
    } catch (error) {
        console.log(error);
    }
}


module.exports.loadSingleProduct = async (req, res) => {
    try {

        console.log(req.query);
        const userId = req.session.user?._id;
        const { productId, index, size, orderId } = req.query;
        const detials = await Order.findOne({ _id: orderId, user: userId }).populate('user').populate('products.productId')
        // console.log(detials);
        const products = detials.products.filter((pro) => pro.productId._id == productId);
        console.log(products);
        const product = detials.products.find((pro) =>  pro.product === index && pro.size === size);
        console.log(product, 'render data')
        res.render('singleProduct', {product: product, address: detials.deliveryDetails });
    } catch (error) {
        console.log(error)
    }
}