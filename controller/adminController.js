
const User = require('../models/userModel');
const Catagery = require('../models/cetagory');
const bcrypt = require('bcrypt');
const product = require('../models/product');
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

        if(req.body.email == email) {
            if(req.body.password == password) {
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
            res.render('userManagement', {users: user});
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

    return User.findOne({_id: id})
    .then((user) => {
        if(user.isBlocked) {
            console.log(user)
            console.log('unblock')
            return User.updateOne({_id: id}, {
                $set: {
                    isBlocked: false
                }
            })
        } else {
            console.log('block')
            return User.updateOne({_id: id }, {
                $set: {
                    isBlocked: true
                }
            })
        }
    })
    .then(() => {
        res.json({block: true});
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
            res.render('adminProducts', {products: data});
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
            res.render('addProduct', {cetagory: data})
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





