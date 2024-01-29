const express = require('express');
const session = require('express-session');
const user_route = express();
const user_controller = require('../controller/userController');
const product_controller = require('../controller/product');
user_route.set('view engine', 'ejs');
user_route.set('views', './views/user');
const shop_controller = require('../controller/shop');
const User = require('../models/userModel');
const cart_controller = require('../controller/cartCotroller');
const order_controller = require('../controller/orderController')
const review_Controller = require('../controller/reviewContoller');
const user_middleware = require('../middleware/userAuth');



const path = require('node:path');
user_route.use(express.static(path.join(__dirname, 'image/product')));

user_route.use(session({
    secret: "sessionscret",
    resave: false,
    saveUninitialized: true
}));
user_route.use(express.json());
user_route.use(express.urlencoded({extended: true}));

user_route.use(async (req, res , next) => {
    const id = req.session.user?._id;
    console.log(id, 'middleware')
    
        const user = await User.findOne({_id: id});

        if(user) {
            if(user.isBlocked) {
                

                fetch('http://localhost:3000/logout', {
                    method: 'POST'
                })
                .catch((err) => {
                    console.log(err)
                })
                
 
             } 
 

        }
            
            next();
})

user_route.use((req, res, next) => {
    res.locals.user = req.session.user || null; 
    res.locals.logedIn = req.session.user ? true : false;
    next();
}); 


// load home
user_route.get('/', user_controller.loadHome);

// load login
user_route.get('/login', user_middleware.isLogined, user_controller.loadLogin);

user_route.post('/login', user_controller.userLogin);

// load register
user_route.get('/signUp', user_middleware.isLogined, user_controller.loadRegister);

// load otp
user_route.get('/otp', user_middleware.isLogined, user_controller.loadotp);

// otp post || verify

user_route.post('/otp', user_controller.verifyOTP);

// register form sumbit
user_route.post('/signUp', user_controller.insertUser);

// login with otp
user_route.post('/otpLogin', user_controller.otpLogin);
// load login with otp page

user_route.get('/otpLogin', user_middleware.isLogined, user_controller.OTPlogin)

// Logout the user
user_route.post('/logout', user_controller.userLogout);

user_route.post('/resend', user_controller.resend);

user_route.get('/productDetails' , product_controller.productdetiles );


user_route.get('/shop', shop_controller.loadShop);


user_route.get('/cart', user_middleware.userAuth, cart_controller.loadCart);

user_route.post('/add-cart', cart_controller.addToCart);

user_route.post('/removeFormCart', cart_controller.removeFromCart);

user_route.post('/counter', cart_controller.changeQuantity);

user_route.post('/checkSession', user_controller.checkSession);

user_route.get('/check-out', user_middleware.userAuth, cart_controller.proceedToCheckout);

user_route.get('/account', user_middleware.userAuth, user_controller.loadMyAccount);
user_route.get('/my-order', user_middleware.userAuth, order_controller.loadMyOrder);

user_route.get('/single-product', user_middleware.userAuth, order_controller.loadSingleProduct)


user_route.post('/add-Address', order_controller.addAddress );

user_route.post('/place-order', order_controller.placeOrder );
user_route.get('/order-success', order_controller.loadOrderSucces );


user_route.post('/search', shop_controller.filter);
user_route.post('/order-cancel', order_controller.orderCancelation)

// ==================================================================== //

user_route.post('/addReview', review_Controller.addReview)

user_route.post('/verifyPayment', order_controller.verifyPayment);

user_route.post('/product-return', order_controller.)

module.exports = user_route;




