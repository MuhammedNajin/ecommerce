const express = require('express');
const app = express();
const mongoose = require('mongoose');

// app.use((req, res, next) => {
//     console.log( req.path, req.method);
//     next()
// })

app.set('view engine', 'ejs');


const path = require('node:path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/assets')));

// user route 
const user_route = require('./router/userRoute');
app.use('/', user_route);

//admin route
const admin_route = require('./router/adminRoute');
app.use('/admin', admin_route);

mongoose.connect('mongodb://127.0.0.1:27017/E-commers')
.then(() => {
    console.log('DB connected');
})
.catch((err) => {
    console.log(err);
})

app.listen(3000, () => {
    console.log('http://localhost:3000');
})












