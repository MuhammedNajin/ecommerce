
const User = require('../models/userModel');
const Catagery = require('../models/cetagory');
const bcrypt = require('bcrypt');
const product = require('../models/product');
const Order = require('../models/order');
const Wallect = require('../models/walletModal');
require('dotenv').config()






// load admin home page 

module.exports.loadAdmin = (req, res) => {
    try {
        res.render('adminDashboard');
    } catch (error) {
        console.log(error);
    }
}


// admin login

module.exports.loadLogin = (req, res) => {
    try {
        res.render('admin-login');
    } catch (error) {
        console.log(error);
    }
}


module.exports.login = async (req, res) => {
    try {

        const email = process.env.email;
        const password = process.env.password;
        console.log(email, password)

        if (req.body.email == email) {
            if (req.body.password == password) {
                req.session.admin = email;
                res.redirect('/admin/');

            } else {
                req.flash('password', 'incorrect password');
                res.redirect('/admin/login')
                console.log('Incorrect password');
            }
        } else {
            req.flash('email', 'Enter valid email address');
            res.redirect('/admin/login')
            console.log('incorrect email');
        }

    } catch (error) {

    }

}



module.exports.loadUser = async (req, res) => {
    try {

        return User.find()
            .then((user) => {
                res.render('userManagement', { users: user });
            })
            .catch((err) => {
                console.log(err)
            })

    } catch (error) {
        console.log(error);
    }
}

module.exports.blockUser = (req, res) => {

    const id = req.body.id;
    console.log(id);

    return User.findOne({ _id: id })
        .then((user) => {
            if (user.isBlocked) {
                console.log(user)
                console.log('unblock')
                return User.updateOne({ _id: id }, {
                    $set: {
                        isBlocked: false
                    }
                })
            } else {
                console.log('block')
                return User.updateOne({ _id: id }, {
                    $set: {
                        isBlocked: true
                    }
                })
            }
        })
        .then(() => {
            res.json({ block: true });
        })
        .catch((err) => {
            console.log(err);
        })
}


// load product management page 
module.exports.loadPoduct = (req, res) => {
    try {
        return product.find().populate('cetagory')
            .then((data) => {
                res.render('adminProducts', { products: data });
            })

    } catch (error) {
        console.log(error);
    }
}

// load add product page 

module.exports.loadAddProduct = (req, res) => {
    try {

        return Catagery.find()
            .then((data) => {
                console.log(data[1].name);
                res.render('addProduct', { cetagory: data })
            })
            .catch((err) => {
                console.log(err);
            })
    } catch (error) {
        console.log(error);
    }
}

module.exports.logout = (req, res) => {
    try {
        req.session.admin = null;
        res.redirect('/admin/login');
    } catch (error) {
        console.log(error);
    }
}



module.exports.loadOrder = async (req, res) => {
    try {

        const order = await Order
            .find()
            .populate('user')
            .populate('products.productId')
            .sort({ date: -1 });
        console.log(order);
        res.render('order-details', { order: order });
    } catch (error) {
        console.log(error)
    }
}


module.exports.loadsingleOrder = async (req, res) => {
    try {
        console.log(req.query)
        const { orderId, returns } = req.query;
        const orderDetails = await Order.findById({ _id: orderId }).populate('user').populate('products.productId');
        console.log(orderDetails)
        if (returns) {
            return res.render('returnSingleProduct', { order: orderDetails })
        }
        res.render('singleOrderDetials', { order: orderDetails })
    } catch (error) {
        console.log(error);
    }
}

module.exports.changeOrderStatus = async (req, res) => {
    console.log('hellllllllllllllllllllllllllllllllleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    try {
        const { orderId, productId, index, status, userId } = req.body;

        console.log(req.body);
        return Order.updateOne({ _id: orderId, user: userId, "products.productId": productId }, {
            $set: {
                [`products.${index}.status`]: status,
            }
        })
            .then(() => {
                res.json({ success: true, status: status });
            })
            .catch((error) => {
                console.log(error);
            })
    } catch (error) {
        console.log(error);
    }
}


module.exports.loadReturns = async (req, res) => {
    try {

        const order = await Order.find({ "products.returnRequest": "requested" }).populate('user').populate('products.productId');
        res.render('returnRequest', { order: order });
    } catch (error) {
        console.log(error);
    }
}

module.exports.returns = async (req, res) => {
        console.log('returns')
    try {
        const { orderId, productId, index, decision, } = req.body
        if(decision === 'accepted') {
            return Order.findByIdAndUpdate({_id: orderId, "products.productId": productId}, {
                $set: { 
                    [`products.${index}.returnRequest`]: decision,
                    [`products.${index}.status`]: "returned",
                }
             },
             { 
                new: true 
             }
             )
             .then( async (data) => {

                 if(data.paymentMethod === 'razorpay' || 'paypal') {
                    const amount = data.totalAmount;
                    console.log(amount);
                    await Wallect.updateOne({ user: data.user }, {
                        $inc: {
                            amount: amount,
                        }
                    })

                 }
                const quantity = data.products[index].quantity;
                return product.findOneAndUpdate({ _id: productId }, {
                    $inc: {
                        [`variant.${index}.stock`]: quantity
                    }
                })
                    
             })
        } else {
            await Order.findByIdAndUpdate({_id: orderId, "products.productId": productId}, {
                $set: { 
                    [`products.${index}. returnRequest`]: decision,
                }
             })

        }
    } catch (error) {
        console.log(error)
    }
}