const express = require('express');
const admin_route = express();
const admin_controller = require('../controller/adminController');
const product_controller = require('../controller/product');
const cetagory_contorller = require('../controller/cetagoryController');

const multer = require('../middleware/multer');




admin_route.set('veiw engine', 'ejs');
admin_route.set('views', './views/admin')
// load home page
admin_route.get('/', admin_controller.loadAdmin);

// load user management

admin_route.get('/user', admin_controller.loadUser);

// block user

admin_route.post('/blockUser', admin_controller.blockUser);


// load product 

admin_route.get('/product', admin_controller.loadPoduct);

// load add Product 

admin_route.get('/addProduct', admin_controller.loadAddProduct);

// load cetagory 

admin_route.get('/cetagory', cetagory_contorller.loadCategory);

// load add cetagory

admin_route.post('/addCetagory', cetagory_contorller.AddCetogory);

// cetagory list / Unlist

admin_route.post('/listCetagory', cetagory_contorller.listCetagory);

// edit cetagory 

admin_route.post('/editCetagory', cetagory_contorller.editCetagory);

// add-product 

admin_route.post('/add-product',multer.array('images'), product_controller.addproduct);








module.exports = admin_route;