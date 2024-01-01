
const User = require('../models/userModel');
const Catagery = require('../models/cetagory');
const bcrypt = require('bcrypt');






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
        res.render('adminLogin');
    } catch (error) {
        console.log(error);
    }
}


module.exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const pass = req.body.password
        if(email) {
            const admin = await User.findOne({email: email});
            if(admin) {
                    if(admin.isAdmin) {
                             const pass = await bcrypt.compare(pass, admin.password);
                             if(pass) {
                                req.session.admin = {
                                    _id: admin._id,
                                    name: admin.name,
                                    email: admin.email,
                                } 
                                res.redirect('/');
                             } else{
                                console.log('incorrect password')
                             }
                    } else {
                        console.log('you are not an admin')
                    }
            } else {
                console.log('credential cant found')
            }
        } else {
            console.log('admin Email didt recived ')
        }
    } catch (error) {
        console.log(error)
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
        res.render('adminProducts')
    } catch (error) {
        console.log(error);
    }
}

// load add product page 

module.exports.loadAddProduct = (req, res) => {
    try {
        res.render('addProduct');
    } catch (error) {
        console.log(error);
    }
}

// load cetagory

module.exports.loadCategory = (req, res) => {
    try {
        return Catagery.find()
        .then((data) => {
            if(data) {
            res.render('Catagery', {cetagorys: data});
            } 
        })
        
    } catch (error) {
        console.log(error);
    }
}

// add cetagory

module.exports.AddCetogory = (req, res) => {
    try {

        const data = req.body.data;
        if(data) {
            const cetagory = new Catagery({
                name: data,
                isListed: true,

            })

            return cetagory.save()
            .then((saved) => {
                if(saved) {
                  res.json({saved: true});
                }
            })
            .catch((err) => {
                console.log('err');
            })

        } else {
            console.log('data did not recived....');
        }
       

    } catch (error) {
        console.log(error)
    }
}

module.exports.listCetagory = (req, res) => {
    try {
        console.log('Reiched at list?')
        const id = req.body.data;
        console.log(id);
        return Catagery.findOne({_id: id})
        .then((user) => {
            if(user.isListed) {

                return Catagery.updateOne({_id: id},{
                    $set: {
                        isListed: false,
                    }
                })

            } else{
                return Catagery.updateOne({_id: id}, {
                    $set: {
                        isListed: true,
                    }
                })
            }
        })
        .then(() => {
             res.json({listed: true});
        })
        .catch((err) => {
            console.log(err);
        })
        
    } catch (error) {
        console.log(error)
    }
}