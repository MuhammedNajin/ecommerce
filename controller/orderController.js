
const Address = require('../models/address');

module.exports.addAddress = async (req, res) => {
    try {
        console.log(req.body);
        const userid = req.session.user?._id;

       if(userid) {


        const fullname = req.body.fname + " " + req.body.lname;

        const userAddress = {
            fullName: fullname,
            country: req.body.country,
            address: req.body.address,
            state: req.body.state,
            city: req.body.city,
            pincode: req.body.pin,
            phone: req.body.phone,
            email: req.body.email
        }

        const address = new Address({
            user: userid,
            address: userAddress
         })

         await address.save();
         res.redirect('/check-out');

       } else {
        console.log('id didt recived');
       }
    






    } catch (error) {
        console.log(error)
    }
}


module.exports.placeOrder = async (req, res) => {
    try {

        console.log(req.body);
           const userId = req.session.user?._id;
           const {adress, payment_method, subtotal} = req.body



           
    } catch (error) {
        console.log(error)
    }
}