const express = require('express');
const session = require('express-session');
const user_route = express();
const user_controller = require('../controller/userController');
const product_controller = require('../controller/product');
user_route.set('view engine', 'ejs');
user_route.set('views', './views/user');


const path = require('node:path');
user_route.use(express.static(path.join(__dirname, 'image/product')));

user_route.use(session({
    secret: "sessionscret",
    resave: false,
    saveUninitialized: true
}));
user_route.use(express.json());
user_route.use(express.urlencoded({extended: true}));



user_route.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.logedIn = req.session.user ? true : false;
    next();
}); 
// load home
user_route.get('/', user_controller.loadHome);

// load login
user_route.get('/login', user_controller.loadLogin);

user_route.post('/login', user_controller.userLogin);

// load register
user_route.get('/signUp', user_controller.loadRegister);

// load otp
user_route.get('/otp', user_controller.loadotp);

// otp post || verify

user_route.post('/otp', user_controller.verifyOTP);

// register form sumbit
user_route.post('/signUp', user_controller.insertUser);

// login with otp
user_route.post('/otpLogin', user_controller.otpLogin);
// load login with otp page

user_route.get('/otpLogin', user_controller.OTPlogin)

// Logout the user
user_route.post('/logout', user_controller.userLogout);

user_route.post('/resend', user_controller.resend);

user_route.get('/productDetails' , product_controller.productdetiles )


module.exports = user_route;




