const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const verifyOtp = require("../models/otpVerification");
const Product = require("../models/product");
const Wallect = require("../models/walletModal");
const Address = require("../models/address");

// load home page
module.exports.loadHome = async (req, res) => {
  try {
    const product = await Product.find({ isListed: true }).populate("cetagory");

    if (product) {
      res.render("home", { product: product });
    }
  } catch (error) {
    console.log(error);
  }
};

// ================================== User login ===============================================\\

// load login page
module.exports.loadLogin = (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
  }
};

module.exports.userLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (user.verified) {
        if (user.isBlocked) {
          req.flash("blocked", "You are blocked by admin");
          res.redirect("/login");
          console.log("User is blocked");
        } else {
          const enteredPass = req.body.password;
          const databasePass = user.password;
          const pass = await bcrypt.compare(enteredPass, databasePass);
          console.log(pass);
          if (pass) {
            req.session.user = {
              _id: user._id,
              name: user.name,
              email: user.email,
            };

            res.redirect(`/`);
          } else {
            req.flash("pass", "Enter correct password");
            res.redirect("/login");
            console.log("enter correct password");
          }
        }
      } else {
        res.redirect(`/otp?email=${email}&is=${true}&first=${true}`);
        console.log("user not verified");
      }
    } else {
      req.flash("found", "Email not found");
      res.redirect("/login");
      console.log("user not found");
    }
  } catch (error) {
    console.log(error);
  }
};

// ======================================Ueser sign UP and otp verification ==============================================  \\

// load sign up page
module.exports.loadRegister = (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log(error);
  }
};

// register user
module.exports.insertUser = async (req, res) => {
  try {
    const uname = await User.findOne({ name: req.body.uname });
    const email = await User.findOne({ email: req.body.email });

    if (uname) {
      req.flash("uname", "Username already exists");
      res.redirect("/signUp");
    } else if (email) {
      req.flash("email", "Email already exists");
      res.redirect("/signUp");
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
      });

      const save = await user.save();
      // console.log(user.email);
      if (save) {
        sentOtp(user.email);
        res.redirect(`/otp?email=${user.email}`);
      } else {
        console.log("not saved....");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// sent otp and load otp page

const sentOtp = async (email) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "najinn675@gmail.com",
        pass: 'cxty fwre zatm qdgl',

      },
    });

    const createdOTP = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOption = {
      from: "najinn675@gmail.com",
      to: email,
      subject: "OTP Verification",
      html: `Your otp is ${createdOTP}`,
    };

    await transport.sendMail(mailOption);
    const hashOTP = await bcrypt.hash(createdOTP, 10);

    const otp = new verifyOtp({
      Email: email,
      otp: hashOTP,
    });

    await otp.save();
    // const isSave = await otp.save();

    // if(isSave) {

    // }
  } catch (error) {
    console.log(error);
  }
};

// load otp page
module.exports.loadotp = async (req, res) => {
  try {
    console.log(req.query.is, "is");
    if (req.query.is && req.query.first) {
      sentOtp(req.query.email);
    }
    console.log(req.query.email);
    const email = req.query.email || "******gmail.com";

    const user1 = await User.findOne({ email: email });
    console.log(user1);
    const verify = user1.verified;
    console.log(verify);
    res.render("otp", { email: email, verify: verify });
  } catch (error) {
    console.log(error);
  }
};

// load login with otp page

module.exports.OTPlogin = (req, res) => {
  try {
    res.render("otpLogin");
  } catch (error) {
    console.log(error);
  }
};

// verify otp

module.exports.verifyOTP = async (req, res) => {
  try {
    const email = req.query.email;
    console.log("otp verify email", email);

    const otp = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4;

    const verify = await verifyOtp.findOne({ Email: email });

    if (verify) {
      const { otp: hashed } = verify;
      const compare = await bcrypt.compare(otp, hashed);
      console.log(compare);
      if (compare) {
        const user = await User.findOne({ email: email });

        if (user) {
          await User.findByIdAndUpdate(
            { _id: user._id },
            { $set: { verified: true } }
          );
          req.session.user = {
            _id: user._id,
            email: user.email,
            name: user.name,
          };

          await User.updateOne({ _id: user._id }, { $set: { session: true } });
          await verifyOtp.deleteOne({ email: email });
          const wallect = new Wallect({ user: user._id });
          await wallect.save();
          res.redirect(`/`);
        } else {
          console.log("user not found");
        }
      } else {
        req.flash("incorrect", "please enter valid otp");
        res.redirect(`/otp?email=${email}`);
        console.log("OTP is incorrect");
      }
    } else {
      req.flash("expired", "OTP experied resend ");
      res.redirect(`/otp?email=${email}`);
      console.log("otp expired");
    }
  } catch (error) {
    console.log(error);
  }
};

// Login with otp
module.exports.otpLogin = async (req, res) => {
  try {
    const email = req.query.email;
    console.log(email);

    const otp = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4;
    const find = await verifyOtp.findOne({ Email: email });

    if (find) {
      const compare = await bcrypt.compare(otp, find.otp);
      const user = await User.findOne({ email: email });
      if (compare) {
        req.session.user = {
          _id: user._id,
          name: user.name,
          email: user.email,
        };

        res.redirect("/");
      } else {
        req.flash("incorrect", "Enter valid otp");
        res.redirect(`/otp?email=${email}&is=${true}`);
        console.log("OTP incorrect", "from otp login");
      }
    } else {
      req.flash("expired", "OTP expired resend otp");
      res.redirect(`/otp?email=${email}&is=${true}`);
      console.log("otp expired", "from otp login");
    }
  } catch (error) {
    console.log(error);
  }
};
// ============================================ User sign up ends =============================================\\

// user logout

module.exports.userLogout = async (req, res) => {
  try {
    req.session.user = null;
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

module.exports.resend = async (req, res) => {
  try {
    const email = req.query.email;
    console.log(email);
    if (email) {
      await verifyOtp.deleteMany({ Email: email });
      sentOtp(email);
      res.json({ ok: true });
    } else {
      console.log("Email doest receiced");
    }
  } catch (error) {
    console.log(error);
  }
};

// check session

module.exports.checkSession = (req, res) => {
  try {
    if (req.session) {
      res.json({ session: true });
    } else {
      res.json({ session: false });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.loadMyAccount = async (req, res) => {
  try {
    const userId = req.session.user?._id;
    const userDetails = await User.findById({ _id: userId });
    res.render("myAccount", { userDetails });
  } catch (error) {
    console.log(error);
  }
};

module.exports.loadManageAddress = async (req, res) => {
  try {
    const userId = req.session.user?._id;
    if (!userId) {
      // res.status(500).render('opps');
    }
    const addresses = await Address.findOne({ user: userId });
    if (!addresses) {
      // res.status(404).render('oops');
    }
    res.render("manageAddress", { address: addresses.address });
  } catch (error) {
    console.log(error);
    // res.status(404).render('oops');
  }
};

module.exports.editAddress = async (req, res) => {
  try {
    console.log(req.body);
    const userid = req.session.user?._id;
    const index = req.body.index;

    if (!userid) {
      //    res.status(500).render('oops');
      console.log("user not found");
    }

    if (!index) {
      // res.status(500).render('oops');
      console.log("index not found");
    }

    const fullname = req.body.fname + " " + req.body.lname;

    const userAddress = {
      fullName: fullname,
      country: req.body.country,
      address: req.body.address,
      state: req.body.state,
      city: req.body.city,
      pincode: req.body.pin,
      phone: req.body.phone,
      email: req.body.email,
    };

    await Address.findOneAndUpdate(
      { user: userid },
      {
        $set: {
          [`address.${index}`]: userAddress,
        },
      }
    );
    res.redirect("/manage-address");
  } catch (error) {
    //  res.status(500).render('oops');
    console.log(error);
  }
};

module.exports.deleteAddress = async (req, res) => {
  try {
    console.log("delete request");
    const { index } = req.params;
    const userId = req.session.user?._id;
    console.log(index);
    if (!index) {
      console.log("index not recived");
    }

    await Address.findOneAndUpdate(
      { user: userId },
      {
        $unset: {
          [`address.${index}`]: 1,
        },
      }
    );

    await Address.findOneAndUpdate(
      { user: userId },
      {
        $pull: {
          address: null,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    console.log("hellooo");
    const userId = req.session.user?._id;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    console.log(req.body);
    if (!userId) {
      return res.status(500).send("user not found");
    }

    const user = await User.findById({ _id: userId });
    const oldpass = await bcrypt.compare(oldPassword, user.password);

    if (!oldpass) {
      console.log(oldpass, "heloo2");
      return res.json({ old: true, massage: "enter correct old password" });
    }
    if (oldpass === newPassword) {
      return res.json({ old: true, massage: "Enter new password" });
    }

    if (newPassword !== confirmPassword) {
      return res.json({ notSame: true, massage: "conform your password" });
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(newPassword)) {
      return res.json({ new: true, massage: "Enter strong password" });
    }

    const hashPass = await bcrypt.hash(newPassword, 10);
    const changePassword = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          password: hashPass,
        },
      }
    );
    if (changePassword) {
      return res.json({ success: true });
    }
  } catch (error) {}
};

module.exports.personalDetails = async (req, res) => {
  try {
    const userId = req.session.user?._id;
    const { value, cls } = req.body;
    console.log(req.body);
    if (!userId) {
      res.redirect("/");
    }

    if (cls === "editUserName") {
      if (!/^\w+$/.test(value)) {
        res.json({ username: true, massage: "enter correct username" });
      } else {
        const username = await User.findOne({ name: value });

        if (username) {
          res.json({ username: true, massage: "username alreay exist" });
        } else {
          const username = await User.findByIdAndUpdate(
            { _id: userId },
            {
              $set: {
                name: value,
              },
            }
          );
          if (username) {
            return res.json({
              success: true,
              massage: "username successfully updated",
            });
          }
        }
      }
    } else if (cls === "editEmail") {
      if (value.indexOf("@") == -1 || !value.endsWith("gmail.com")) {
        res.json({ email: true, massage: "enter correct email" });
      } else {
        const email = await User.findOne({ email: value });

        if (email) {
          res.json({ email: true, massage: "email alreay exist" });
        } else {
          const username = await User.findByIdAndUpdate(
            { _id: userId },
            {
              $set: {
                email: value,
              },
            }
          );
          if (username) {
            return res.json({
              success: true,
              massage: "email successfully updated",
            });
          }
        }
      }
    } else if (cls === "editPhone") {
      if (value.trim().length < 10 || !/^\d+$/.test(value)) {
        res.json({ phone: true, massage: "enter correct phone number" });
      } else {
        const phone = await User.findOne({ mobile: value });

        if (phone) {
          res.json({ phone: true, massage: "phone number alreay exist" });
        } else {
          const username = await User.findByIdAndUpdate(
            { _id: userId },
            {
              $set: {
                mobile: value,
              },
            }
          );
          if (username) {
            return res.json({
              success: true,
              massage: "phone number successfully updated",
            });
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.loadAbout = (req, res) => {
  try {
    res.render("aboutUs");
  } catch (error) {}
};

module.exports.loadContact = (req, res) => {
  try {
    res.render("contact");
  } catch (error) {}
};
