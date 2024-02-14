
const User = require('../models/userModel');
const Catagery = require('../models/cetagory');
const bcrypt = require('bcrypt');
const product = require('../models/product');
const Order = require('../models/order');
const Wallet = require('../models/walletModal');
const adminHelpers = require('../helpers/adminHelper');
require('dotenv').config()
// load admin home page 

module.exports.loadAdmin = async (req, res) => {
    try {
        const currentDate = new Date();
        const startDate = new Date(currentDate - 30 * 24 * 60 * 60 * 1000);
        const user = await User.find();
        const userCount = user.length

        const order = await Order.find({ date: { $gte: startDate, $lt: currentDate } });
        console.log(order)
        const order2 = await Order.find();
        const orderCount = order.length
        const montlyEarning = order ? order.reduce((acc, crr) => crr.status === 'placed' ? acc += crr.totalAmount : acc, 0) : 0;
        const revenue = order2 ? order2.reduce((acc, crr) => acc += crr.totalAmount, 0) : 0;
        const product = order ? order.reduce((acc, crr) => acc += crr.products.length, 0) : 0;
        console.log(userCount, orderCount, montlyEarning, revenue, product);

        //calculating  number of order per month

        const monthlyOrderedCount = await Order.aggregate([
            {
                $match: {
                    status: 'placed'
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%m', date: '$date'
                        }
                    },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ])
        const data = Array.from({ length: 12 },).fill(0);

        // Initialize an array with 12 elements, each set to zero
        const monthlyData = Array.from({ length: 12 }).fill(0);

        // Populate the array based on the provided data
        monthlyOrderedCount.forEach(item => {
            console.log(item)
            const monthIndex = parseInt(item._id, 10) - 1; // Convert _id to zero-based index
            if (monthIndex >= 0 && monthIndex < 12) {

                monthlyData[monthIndex] = item.totalAmount;
            }
        });

        console.log(monthlyData); 
        const name = await adminHelpers.bestSelling('name');
        const cetagory = await adminHelpers.bestSelling('cetagory');
        const brand = await adminHelpers.bestSelling('brand');
        console.log(name);

        res.render('adminDashboard', { monthlyData, userCount, montlyEarning, revenue, orderCount, product, name, cetagory, brand});
    } catch (error) {
        console.log(error);
    }
}


module.exports.filterDashboard = async (req, res) => {
    try {
        const { data } = req.body;
        const desiredMonth = data; // Example for January 2024
        const startDate = new Date(desiredMonth + "-01T00:00:00Z"); // Start of month
        const endDate = new Date(desiredMonth + "-31T23:59:59Z"); // End of month (adjusted for days in February)
        console.log(startDate)
        const monthData = await Order.aggregate([
            {
                $match: { 
                    status: 'placed',
                    date: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%d', date: '$date'
                        }
                    },
                    totalAmount: { $sum: '$totalAmount'}
                }

            }
        ])
      console.log(monthData)
       

        // Initialize an array with 12 elements, each set to zero
        const newData = Array.from({ length: 30 }).fill(0);

        // Populate the array based on the provided data
        monthData.forEach(item => {
            console.log(item)
            const monthIndex = parseInt(item._id, 10) - 1; // Convert _id to zero-based index
            if (monthIndex >= 0 && monthIndex < 30) {

                newData[monthIndex] = item.totalAmount;
            }
        });

        console.log(newData);
        res.json({ newData , data});

    } catch (error) {
        console.log(error)
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

        return Order.findByIdAndUpdate({ _id: orderId, user: userId, "products.productId": productId },
            {
                $set: {
                    [`products.${index}.status`]: status,
                }


            },
            {
                new: true
            },
        )
            .then(async (data) => {
                if (status === 'canceled') {
                    const amount = data.products[index].coupon > 0 ? data.products[index].coupon : data.products[index].price;
                    await Wallet.updateOne({ user: userId }, { $set: { amount: amount } });
                }

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
        if (decision === 'accepted') {
            return Order.findByIdAndUpdate({ _id: orderId, "products.productId": productId }, {
                $set: {
                    [`products.${index}.returnRequest`]: decision,
                    [`products.${index}.status`]: "returned",
                }
            },
                {
                    new: true
                }
            )
                .then(async (data) => {


                    const amount = data.products[index].coupon > 0 ? data.products[index].coupon : data.products[index].price;
                    console.log(typeof amount, amount);
                    await Wallet.findOneAndUpdate({ user: data.user }, {
                        $inc: {
                            amount: amount,
                        }
                    })


                    const quantity = data.products[index].quantity;
                    return product.findOneAndUpdate({ _id: productId }, {
                        $inc: {
                            [`variant.${index}.stock`]: quantity
                        }
                    })

                })
        } else {
            await Order.findByIdAndUpdate({ _id: orderId, "products.productId": productId }, {
                $set: {
                    [`products.${index}. returnRequest`]: decision,
                }
            })

        }
    } catch (error) {
        console.log(error)
    }
}