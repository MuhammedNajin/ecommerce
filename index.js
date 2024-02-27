const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next(); 
});
// make other http verbs with form
const methodOverried = require("method-override");
app.use(methodOverried("_method"));

const flash = require("express-flash");

app.use(flash());

app.set("view engine", "ejs");
app.set("views", "./views/user");

const path = require("node:path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/assets")));

// user route
//admin route

const userRoute = require("./router/userRoute");
app.use("/", userRoute);

const adminRoute = require("./router/adminRoute");
app.use("/admin", adminRoute);

app.use("*", (req, res) => {
  res.render("404");
});

mongoose
  .connect("mongodb+srv://najinn675:naji123@cluster0.lvu9ql4.mongodb.net/")
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
