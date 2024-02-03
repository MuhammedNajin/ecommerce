const  Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');

module.exports.loadCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.find()
        res.render('couponManagement', { coupon })
    } catch (error) {
        console.log(error);
    }
}


module.exports.createCoupon = async (req, res) => {

    const { name, adate, edate, limit, damount, id } = req.body;


    const firstname = name.split('').slice(0, 4).join('');
    const randomString = Math.random().toString(36).substring(2, 7);
    const radomNumber = `${Math.floor(1000 + Math.random() * 9000)}`;

    try {
        console.log(req.body);
        const exists = await Coupon.findById({ _id: id });
        if (exists) {
            await Coupon.findByIdAndUpdate({ _id: id }, {
                $set: {
                    name: name,
                    activationDate: adate,
                    expiresDate: edate,
                    discountAmount: damount,
                    limit: limit,
                }
            })
        } else {
            const newCoupon = new Coupon({
                name: name,
                couponCode: `${firstname}${randomString}${radomNumber}`,
                activationDate: adate,
                expiresDate: edate,
                discountAmount: damount,
                limit: limit,
            })
            await newCoupon.save();

        }
        res.redirect('/admin/load-coupon');
    } catch (error) {
        console.log(error);
    }
}


module.exports.checkCoupon = async (req, res) => {
    try {
        
        const { couponCode } = req.body;
        console.log(couponCode)
        const userId = req.session.user?._id;

        const coupon = await Coupon.findOne({ couponCode: couponCode});


        if(coupon) {
        const alreadyUsed = coupon.userUsed.find((user) => user === userId);
        console.log(alreadyUsed)
            // formating date 
        const today = new Date();
        const active = new Date(coupon.activationDate);
        console.log(active, 'active');
        const expire = new Date(coupon.expiresDate);
        console.log(expire, 'hello');

         if (alreadyUsed) {

            res.json({used: true, massage: 'This coupon is already used'});

        } else if(coupon.limit !== -1 || coupon.limit < coupon.userUsed.length) {

            res.json({ limit: true, massage: 'Coupon is expried' })

        } else if(today >= active && today <= expire) {

            res.json({ expired: true, massage: 'Coupon expired' });

        } else if(cartAmount >= 500) {

            res.json({ min: true, massage: 'Minimum ₹500 needed' });

        } else {


             // taking amount 

        const cart = await Cart.findOne({user: userId});
       
        let discount = 0;

        if(coupon.percentage){

           

        } else if(coupon.discountAmount) {

           const div = Coupon.discountAmount / cart.products.length;
           discount = Math.round(div);

        }
        const cartAmount = cart.products.filter((acc, crr) => {
                    if( crrcrr.totalPrice >= discount ) {
                        return acc += ( crr.totalPrice - discount )
                    } else {
                        
                        return acc += crr.totalPrice;

                    }
        }, 0);



            res.json({ success: true, subtotal: cartAmount });

        }

        } else {

            res.json({notAvailable: true, massage: 'No coupon  available'});

        }
        
       
        
       

        


    } catch (error) {
        console.log(error);
    }
}