const express = require('express');
const session = require('express-session');
const userRoute = express();
const userController = require('../controller/userController');
const productController = require('../controller/product');
userRoute.set('view engine', 'ejs');
userRoute.set('views', './views/user');
const shopController = require('../controller/shop');
const User = require('../models/userModel');
const cartController = require('../controller/cartCotroller');
const orderController = require('../controller/orderController')
const review_Controller = require('../controller/reviewContoller');
const userMiddleware = require('../middleware/userAuth');
const couponController = require('../controller/couponController');
const { loadData } = require('../middleware/userMiddilware');
const wishlistController = require('../controller/wishlistController');

const nocache = require('nocache');


userRoute.use(nocache());

userRoute.use((req, res, next) => {
    res.header('Cache-Control', 'no-store, private, must-revalidate');
    next();
});



const path = require('node:path');
userRoute.use(express.static(path.join(__dirname, 'image/product')));

userRoute.use(session({
    secret: "sessionscret",
    resave: false,
    saveUninitialized: true
}));

userRoute.use(express.json());
userRoute.use(express.urlencoded({extended: true}));


userRoute.use(async (req, res , next) => {
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

userRoute.use((req, res, next) => {
    res.locals.user = req.session.user || null; 
    res.locals.logedIn = req.session.user ? true : false;
    next();
}); 

userRoute.use(loadData);

// load home
userRoute.get('/', userController.loadHome);

// load login
userRoute.get('/login', userMiddleware.isLogined, userController.loadLogin);

userRoute.post('/login', userController.userLogin);

// load register
userRoute.get('/signUp', userMiddleware.isLogined, userController.loadRegister);

// load otp
userRoute.get('/otp', userMiddleware.isLogined, userController.loadotp);

// otp post || verify

userRoute.post('/otp', userController.verifyOTP);

// register form sumbit
userRoute.post('/signUp', userController.insertUser);

// login with otp
userRoute.post('/otpLogin', userController.otpLogin);
// load login with otp page

userRoute.get('/otpLogin', userMiddleware.isLogined, userController.OTPlogin)

// Logout the user
userRoute.post('/logout', userController.userLogout);

userRoute.post('/resend', userController.resend);

userRoute.get('/productDetails' , productController.productdetiles );


userRoute.get('/shop', shopController.loadShop);


userRoute.get('/cart', userMiddleware.userAuth, cartController.loadCart);

userRoute.post('/add-cart', cartController.addToCart);

userRoute.post('/removeFormCart', cartController.removeFromCart);

userRoute.post('/counter', cartController.changeQuantity);

userRoute.post('/checkSession', userController.checkSession);

userRoute.get('/check-out', userMiddleware.userAuth, cartController.proceedToCheckout);

userRoute.get('/account', userMiddleware.userAuth, userController.loadMyAccount);
userRoute.get('/my-order', userMiddleware.userAuth, orderController.loadMyOrder);

userRoute.get('/single-product', userMiddleware.userAuth, orderController.loadSingleProduct)


userRoute.post('/add-Address', orderController.addAddress );

userRoute.post('/place-order', orderController.placeOrder );
userRoute.get('/order-success', orderController.loadOrderSucces );


userRoute.post('/search', shopController.filter);
userRoute.post('/order-cancel', orderController.orderCancelation);

userRoute.get('/single-orderDetails', orderController.singleOrderDetials)

userRoute.get('/wishlist', wishlistController.loadWhislist);
userRoute.post('/wishlist', wishlistController.addTOWhishlist);
userRoute.post('/remove-wishlist', wishlistController.removeFromWishlist);

userRoute.get('/manage-address', userController.loadManageAddress);


// ==================================================================== //

userRoute.post('/addReview', review_Controller.addReview)

userRoute.post('/verifyPayment', orderController.verifyPayment);

userRoute.post('/product-return', orderController.productReturn);

userRoute.post('/check-coupon', couponController.checkCoupon);

userRoute.get('/my-coupon', couponController.loadMyCoupon);

userRoute.get('/invoice', orderController.loadInvoice);

userRoute.put('/edit-address', userController.editAddress);

userRoute.delete('/delete-address/:index', userController.deleteAddress);

userRoute.put('/change-password', userController.changePassword);

userRoute.post('/change-details', userController.personalDetails);



module.exports = userRoute;



