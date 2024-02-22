const express = require("express");
const adminRoute = express();
const adminController = require("../controller/adminController");
const productController = require("../controller/product");
const cetagoryContorller = require("../controller/cetagoryController");
const couponController = require("../controller/couponController");
const helper = require("../middleware/helper");
const nocache = require("nocache");

adminRoute.use(nocache());

adminRoute.use((req, res, next) => {
  res.header("Cache-Control", "no-store, private, must-revalidate");
  next();
});

const adminAuth = require("../middleware/adminAuth");
const multer = require("../middleware/multer");

adminRoute.use(express.json());
adminRoute.use(express.urlencoded({ extended: true }));

adminRoute.set("veiw engine", "ejs");
adminRoute.set("views", "./views/admin");
// load home page
adminRoute.get("/", adminAuth.islogin, adminController.loadAdmin);

// load user management

adminRoute.get("/user", adminAuth.islogin, adminController.loadUser);

// block user

adminRoute.post("/blockUser", adminController.blockUser);

// load product

adminRoute.get("/product", adminAuth.islogin, adminController.loadPoduct);

// load add Product

adminRoute.get(
  "/addProduct",
  adminAuth.islogin,
  adminController.loadAddProduct
);

// load cetagory

adminRoute.get("/cetagory", adminAuth.islogin, cetagoryContorller.loadCategory);

// load add cetagory

adminRoute.post("/addCetagory", cetagoryContorller.AddCetogory);

// cetagory list / Unlist

adminRoute.post("/listCetagory", cetagoryContorller.listCetagory);

// edit cetagory

adminRoute.post("/editCetagory", cetagoryContorller.editCetagory);

// add-product

adminRoute.post(
  "/add-product",
  multer.array("images"),
  productController.addproduct
);

// list / unlist product
adminRoute.post("/listProduct", productController.listProduct);

// load variant
adminRoute.get(
  "/loadVariant/:id",
  adminAuth.islogin,
  productController.loadVariant
);

// add variant

adminRoute.post(
  "/addVariant",
  multer.array("images"),
  productController.addVariant
);

// load edit variant

adminRoute.get(
  "/edit-variant",
  adminAuth.islogin,
  productController.LoadeditVariant
);

// edit variant

adminRoute.post(
  "/editVariant",
  multer.array("images"),
  productController.editVariant
);

// load admin login
adminRoute.get("/login", adminAuth.logged, adminController.loadLogin);

// login
adminRoute.post("/login", adminController.login);

adminRoute.post("/logout", adminController.logout);

// order

adminRoute.get("/order", adminAuth.islogin, adminController.loadOrder);
adminRoute.get(
  "/single-orderDetails",
  adminAuth.islogin,
  adminController.loadsingleOrder
);

adminRoute.post("/change-orderStatus", adminController.changeOrderStatus);

adminRoute.get("/returns", adminAuth.islogin, adminController.loadReturns);

adminRoute.post("/returns", adminController.returns);

// coupon management

adminRoute.get("/load-coupon", adminAuth.islogin, couponController.loadCoupon);

adminRoute.post("/create-coupon", couponController.createCoupon);

adminRoute.put("/edit-coupon", couponController.createCoupon);

adminRoute.post("/order-filter", adminController.filterDashboard);

adminRoute.get(
  "/sales-report",
  adminAuth.islogin,
  adminController.loadSalesReport
);

module.exports = adminRoute;
