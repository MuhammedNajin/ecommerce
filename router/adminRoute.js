const express = require('express');
const admin_route = express();
const admin_controller = require('../controller/adminController');
const product_controller = require('../controller/product');
const cetagory_contorller = require('../controller/cetagoryController');
const coupon_controller = require('../controller/couponController');
const helper = require('../middleware/helper');
const nocache = require('nocache');


admin_route.use(nocache());

admin_route.use((req, res, next) => {
    res.header('Cache-Control', 'no-store, private, must-revalidate');
    next();
});


const adminAuth = require('../middleware/adminAuth');
const multer = require('../middleware/multer');


admin_route.use(express.json());
admin_route.use(express.urlencoded({extended: true}));


admin_route.set('veiw engine', 'ejs');
admin_route.set('views', './views/admin')
// load home page
admin_route.get('/', adminAuth.islogin, admin_controller.loadAdmin);

// load user management

admin_route.get('/user',adminAuth.islogin, admin_controller.loadUser);

// block user

admin_route.post('/blockUser', admin_controller.blockUser);


// load product 

admin_route.get('/product',adminAuth.islogin, admin_controller.loadPoduct);

// load add Product 

admin_route.get('/addProduct',adminAuth.islogin, admin_controller.loadAddProduct);

// load cetagory 

admin_route.get('/cetagory',adminAuth.islogin, cetagory_contorller.loadCategory);

// load add cetagory

admin_route.post('/addCetagory', cetagory_contorller.AddCetogory);

// cetagory list / Unlist

admin_route.post('/listCetagory', cetagory_contorller.listCetagory);

// edit cetagory 

admin_route.post('/editCetagory', cetagory_contorller.editCetagory);

// add-product 

admin_route.post('/add-product',multer.array('images'), product_controller.addproduct);

// list / unlist product 
admin_route.post('/listProduct', product_controller.listProduct);


// load variant
admin_route.get('/loadVariant/:id',adminAuth.islogin, product_controller.loadVariant);

// add variant 

admin_route.post('/addVariant', multer.array('images'), product_controller.addVariant);

// load edit variant

admin_route.get('/edit-variant',adminAuth.islogin, product_controller.LoadeditVariant);

// edit variant



admin_route.post('/editVariant', multer.array('images'), product_controller.editVariant);

// load admin login
admin_route.get('/login', adminAuth.logged, admin_controller.loadLogin);


// login
admin_route.post('/login',  admin_controller.login);


admin_route.post('/logout', admin_controller.logout);


// order 

admin_route.get('/order', adminAuth.islogin, admin_controller.loadOrder)
admin_route.get('/single-orderDetails', adminAuth.islogin, admin_controller.loadsingleOrder );

admin_route.post('/change-orderStatus', admin_controller.changeOrderStatus)

admin_route.get('/returns', admin_controller.loadReturns);
admin_route.post('/returns', admin_controller.returns)


// coupon management 

admin_route.get('/load-coupon', coupon_controller.loadCoupon);
admin_route.put('/create-coupon', coupon_controller.createCoupon);









module.exports = admin_route;