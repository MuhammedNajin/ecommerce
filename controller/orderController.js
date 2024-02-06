
const Address = require('../models/address');
const Cart = require('../models/cartModel');
const Order = require('../models/order');
const Product = require('../models/product');
const Review = require('../models/reviewModal');
const Wallet = require('../models/walletModal');
const Coupon = require('../models/couponModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');



var instance = new Razorpay({ key_id: 'rzp_test_at0lMzCavdHpBO', key_secret: 'ggKTkKRDipDAjKdXuYDXs6XH' });

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
        const { index, payment_method, subtotal, isCoupon } = req.body

        const cart = await Cart.findOne({ user: userId }).populate('products.productId');
        const products = cart.products;
        const addresses = await Address.findOne({ user: userId }, { "address": 1 });
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
        });



        const order_details = await order.save()
        const oderId = order_details._id;

        // make this as common function 

        const coupon = await Coupon.findOne({ couponCode: isCoupon });
        if (isCoupon) {

            if (coupon.limit >= coupon.userUsed.length) {

                const cart = await Cart.findOne({ user: userId });

                let discount = 0;
                console.log(coupon.discountAmount, "discount amount")

                if (coupon.percentage) {



                } else if (coupon.discountAmount) {

                    console.log(coupon.discountAmount, cart.products.length)

                    const div = coupon.discountAmount / cart.products.length;
                    discount = Math.round(div);
                    console.log(discount + 'discount', 'div: ' + div)

                }

                cartAmount = cart.products.forEach(async (el, i) => {
                    console.log(el)

                    await Order.findByIdAndUpdate({ _id: oderId }, {
                        $set: {
                            [`products.${i}.coupon`]: el.totalPrice >= discount ? el.totalPrice - discount : el.totalPrice,
                        }
                    })
                });
                await Coupon.updateOne({couponCode: isCoupon}, { $set: { userUsed: userId }})

            } else {

                res.json({fail: true, massage: 'Coupon limit exceeds'});



            }
        }

        // Cash on delivery
        if (order_details.status === 'placed') {
            console.log('cod')

            await Cart.deleteOne({ user: userId });

            for (let i = 0; i < cart.products.length; i++) {
                {
                    const productId = products[i].productId;
                    const index = products[i].product;
                    const productQuantity = products[i].quantity;
                    console.log(typeof productQuantity, productQuantity)
                    await Product.updateOne({ _id: productId }, {
                        $inc: {
                            [`variant.${index}.stock`]: - productQuantity
                        }
                    })

                }

            }
            res.json({ success: true });
            // wallect pay 
        } else if (payment_method == 'wallet') {
            console.log('heloo')
            console.log(userId)
            const wallet = await Wallet.findOne({ user: userId })
            console.log(wallet);
            if (subtotal <= wallet.amount) {

                const data = {
                    amount: subtotal,
                    date: new Date(),
                }

                await Wallet.findOneAndUpdate({ user: userId }, { $inc: { amount: -subtotal } }, { $pull: { wallectHistory: data } });
                await Order.findOneAndUpdate({ user: userId }, { $set: { status: "placed" } });


                for (let i = 0; i < cart.products.length; i++) {
                    {
                        const productId = products[i].productId;
                        const index = products[i].product;
                        const productQuantity = products[i].quantity;
                        console.log(typeof productQuantity, productQuantity)
                        await Product.updateOne({ _id: productId }, {
                            $inc: {
                                [`variant.${index}.stock`]: - productQuantity
                            }
                        })

                    }

                }
                await Cart.deleteOne({ user: userId });
                res.json({ wallet: true })

            } else {
                res.json({ wallet: false });
            }

            // razor pay
        } else if (order_details.status === 'pending') {

            const options = {
                amount: subtotal * 100,
                currency: "INR",
                receipt: "" + order_details._id,

            }

            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                }
                console.log(order)
                res.json({ order });
            });
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

module.exports.loadMyOrder = async (req, res) => {
    try {
        const userid = req.session.user?._id;
        console.log(typeof userid, userid);
        const order = await Order.find({ user: userid }).populate('user');
        console.log(order)
        res.render('myOrder', { order: order });
    } catch (error) {
        console.log(error);
    }
}


module.exports.loadSingleProduct = async (req, res) => {
    try {

        console.log(req.query);
        const userId = req.session.user?._id;
        const { productId, index, size, orderId } = req.query;
        const detials = await Order.findOne({ _id: orderId, user: userId }).populate('user').populate('products.productId');
        const product = detials.products.find((pro, i) => i === parseInt(index));
        const review = await Review.findOne({ user: userId, productId: productId });
        res.render('singleProduct', { product: product, address: detials.deliveryDetails, review: review, orderId: orderId, index: index, order: detials });
    } catch (error) {
        console.log(error)
    }
}

module.exports.orderCancelation = async (req, res) => {
    try {
        console.log('ssssssssss')
        const { orderId, productId, index, cancelReason } = req.body;
        const userId = req.session.user?._id;
        console.log(req.body)

        if (userId) {

            return Order.findByIdAndUpdate({ _id: orderId, "products.productId": productId }, {
                $set: {
                    [`products.${index}.status`]: 'canceled',
                    [`products.${index}.cancelReason`]: cancelReason,
                }
            },
                { new: true }
            )
                .then( async(data) => {
                    console.log(data, 'goooooooooooooot');
                    const quantity = data.products[index].quantity;
                    if(data.paymentMethod === 'razorpay' || 'wallet') {
                        const amount =  data.products[index].coupon > 0 ? data.products[index].coupon : data.products[index].price;
                        await Wallet.updateOne({user: userId}, {$set: { amount: amount }});

                    }
                   
                    return Product.findOneAndUpdate({ _id: productId }, {
                        $inc: {
                            [`variant.${index}.stock`]: quantity
                        }
                    })
                })
                .then(() => {
                    res.json({ canceled: true });
                })
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports.verifyPayment = async (req, res) => {
    try {
        const { payment, order } = req.body;
        const userId = req.session.user?._id;
        console.log(req.body);
        const hmac = crypto.createHmac("sha256", "ggKTkKRDipDAjKdXuYDXs6XH");
        hmac.update(payment.razorpay_order_id + "|" + payment.razorpay_payment_id);
        const hmacValue = hmac.digest("hex");

        if (hmacValue === payment.razorpay_signature) {

            const cart = await Cart.findOne({ user: userId }).populate('products.productId');
            const products = cart.products;
            console.log('payemnt verifycation successful', products[0].productId._id)
            // decreasing the quatity of products
            for (let i = 0; i < cart.products.length; i++) {
                {
                    const productId = products[i].productId._id;

                    const index = products[i].product;
                    const productQuantity = products[i].quantity;
                    console.log(typeof productQuantity, productQuantity)
                    await Product.findByIdAndUpdate({ _id: productId }, {
                        $inc: {
                            [`variant.${index}.stock`]: - productQuantity
                        }
                    })

                }

            }
            // updating order status 
            await Order.findByIdAndUpdate({ _id: order.receipt }, {
                $set: { status: 'placed', paymentId: payment.razorpay_payment_id }
            });

            await Cart.deleteOne({ user: userId })
            res.json({ payment_successful: true })
        }

    } catch (error) {
        console.log(error);
    }
}


module.exports.productReturn = async (req, res) => {
    try {
        const { orderId, productId, index, returnReason } = req.body;

        const userId = req.session.user?._id;
        console.log(req.body, userId)
        if (userId) {
            return Order.findOneAndUpdate({ _id: orderId, "products.productId": productId }, {
                $set: {
                    [`products.${index}.returnRequest`]: "requested",
                    [`products.${index}.returnReason`]: returnReason,
                }
            })
                .then(() => {
                    res.json({ return: true })
                })
        }

    } catch (error) {
        console.log(error)
    }
}


module.exports.singleOrderDetials = async (req, res) => {
    try {
        const userId = req.session.user?._id;
        if (userId) {
            const { orderId } = req.query;
            const order = await Order.findById({ _id: orderId }).populate('user').populate('products.productId');
            console.log(order)
            res.render('orderDetails', { myOrder: order });
        }
    } catch (error) {
        console.log(error)
    }
}