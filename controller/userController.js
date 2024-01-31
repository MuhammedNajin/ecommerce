const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const verifyOtp = require('../models/otpVerification');
const Product = require('../models/product');
const Wallect = require('../models/walletModal');




// load home page
module.exports.loadHome = async (req, res) => {
    try {

         
           

      const product = await Product.find({ isListed: true }).populate('cetagory')

    //   console.log(product)`


      if(product) {
        res.render('home', { product: product,});
      }
       
    } catch (error) {
        console.log(error)
    }
}


// ================================== User login ===============================================\\

// load login page
module.exports.loadLogin = (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error)
    }
}

module.exports.userLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (user.verified) {

                if (user.isBlocked) {
                    req.flash('blocked', 'You are blocked by admin');
                    res.redirect('/login');
                    console.log('User is blocked');
                } else {
                    const enteredPass = req.body.password;
                    const databasePass = user.password;
                    const pass = await bcrypt.compare(enteredPass, databasePass);
                    console.log(pass);
                    if (pass) {
                        req.session.user = {
                            _id: user._id,
                            name: user.name,
                            email: user.email
                        }
                        
                        res.redirect(`/`);
                    } else {
                        req.flash('pass', 'Enter correct password');
                        res.redirect('/login')
                        console.log('enter correct password');
                    }
                }

            } else {
                res.redirect(`/otp?email=${email}&is=${true}&first=${true}`);
                console.log('user not verified');
            }
        } else {
            req.flash('found', 'Email not found');
            res.redirect('/login')
            console.log('user not found');
        }
    } catch (error) {
        console.log(error);
    }
}








// ======================================Ueser sign UP and otp verification ==============================================  \\

// load sign up page
module.exports.loadRegister = (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.log(error)
    }
}





// register user
module.exports.insertUser = async (req, res) => {
    try {
        const uname = await User.findOne({ name: req.body.uname });
        const email = await User.findOne({ email: req.body.email });

        if (uname) {
            req.flash('uname', 'Username already exists');
            res.redirect('/signUp');
        } else if (email) {
            req.flash('email', 'Email already exists');
            res.redirect('/signUp');
        } else {
            const passHash = await bcrypt.hash(req.body.password, 10);

            const user = new User({
                name: req.body.uname,
                email: req.body.email,
                mobile: req.body.phone,
                password: passHash,
                isAdmin: false,
                isBlocked: false,
                verified: false,
            })

            const save = await user.save();
            // console.log(user.email);
            if (save) {
                sentOtp(user.email);
                res.redirect(`/otp?email=${ user.email }`);
            } else {
                console.log('not saved....');
            }
        }

    } catch (error) {
        console.log(error)
    }
}


// sent otp and load otp page

const sentOtp = async (email) => {
    try {

        const transport = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: 'najinn675@gmail.com',
                pass: 'dnkc erej pptj fnif'
            }

        })

        const createdOTP = `${Math.floor(1000 + Math.random() * 9000)}`


        const mailOption = {
            from: 'najinn675@gmail.com',
            to: email,
            subject: 'OTP Verification',
            html: `Your otp is ${createdOTP}`
        }

        await transport.sendMail(mailOption);
        const hashOTP = await bcrypt.hash(createdOTP, 10);

        const otp = new verifyOtp({
            Email: email,
            otp: hashOTP
        })

        await otp.save();
        // const isSave = await otp.save();

        // if(isSave) {

        // }


    } catch (error) {
        console.log(error);
    }
}


// load otp page
module.exports.loadotp = async (req, res) => {
    try {
        console.log(req.query.is,'is');
        if (req.query.is && req.query.first) {
            sentOtp(req.query.email);
        }
        console.log(req.query.email);
        const email = req.query.email || '******gmail.com';
        
        const user1 = await User.findOne({ email: email })
        console.log(user1)
          const verify = user1.verified; 
          console.log(verify);
        res.render('otp', { email: email, verify: verify});

    } catch (error) {
        console.log(error);
    }
}

// load login with otp page

module.exports.OTPlogin = (req, res) => {
    try {
        res.render('otpLogin')
    } catch (error) {
        console.log(error)
    }
}

// verify otp 

module.exports.verifyOTP = async (req, res) => {
    try {

        const email = req.query.email;
        console.log('otp verify email', email);


        const otp = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4;

        const verify = await verifyOtp.findOne({ Email: email });


        if (verify) {
            const { otp: hashed } = verify;
            const compare = await bcrypt.compare(otp, hashed);
            console.log(compare);
            if (compare) {

                const user = await User.findOne({ email: email });

                if (user) {
                    await User.findByIdAndUpdate({ _id: user._id }, { $set: { verified: true } });
                    req.session.user = {
                        _id: user._id,
                        email: user.email,
                        name: user.name
                    }

                    await User.updateOne({_id: user._id}, {$set: {session: true}});
                    await verifyOtp.deleteOne({ email: email })
                    const wallect = new Wallect({user: user._id});
                    await wallect.save();    
                    res.redirect(`/`);

                } else {
                    console.log('user not found');
                }
            } else {
                req.flash('incorrect', 'please enter valid otp');
                res.redirect(`/otp?email=${email}`);
                console.log('OTP is incorrect');
            }
        } else {
                req.flash('expired', 'OTP experied resend ');
                res.redirect(`/otp?email=${email}`);
            console.log('otp expired')
        }


    } catch (error) {
        console.log(error);
    }
}



// Login with otp
module.exports.otpLogin = async (req, res) => {
    try {
        const email = req.query.email;
        console.log(email)

        const otp = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4;
        const find = await verifyOtp.findOne({ Email: email });

        if (find) {

            const compare = await bcrypt.compare(otp, find.otp);
            const user = await User.findOne({ email: email });
            if (compare) {
                req.session.user = {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }

                
                res.redirect('/');

            } else {

                req.flash('incorrect', 'Enter valid otp');
                res.redirect(`/otp?email=${email}&is=${true}`);
                console.log('OTP incorrect', 'from otp login')

            }

        } else {
            req.flash('expired', 'OTP expired resend otp');
            res.redirect(`/otp?email=${email}&is=${true}`);
            console.log('otp expired', 'from otp login')
        }
    } catch (error) {
        console.log(error);
    }
}
// ============================================ User sign up ends =============================================\\


// user logout

module.exports.userLogout = async (req, res) => {
    try {
         
            req.session.user = null;
            res.redirect('/');
       
    } catch (error) {
        console.log(error)
    }
}


module.exports.resend = async (req, res) => {
    try {
        const email = req.query.email;
        console.log(email);
        if(email) {
          await verifyOtp.deleteMany({Email: email});
             sentOtp(email);
             res.json({ok: true});
        } else {
            console.log('Email doest receiced');
        }
          
    } catch (error) {
        console.log(error)
    }


}

// check session 

module.exports.checkSession = (req, res) => {
    try {
        if(req.session) {
            res.json({session: true});
        } else {
            res.json({session: false});
        }
        
    } catch (error) {
        console.log(error);
    }
}

module.exports.loadMyAccount = async(req, res) => {
    try {
        res.render('myAccount');
    } catch (error) {
        console.log(error)
    }
}