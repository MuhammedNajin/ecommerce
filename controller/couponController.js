const Cart = require('../models/cartModel');
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

    const { name, adate, edate, limit, damount} = req.body;


    const firstname = name.split('').slice(0, 4).join('');
    const randomString = Math.random().toString(36).substring(2, 7);
    const radomNumber = `${Math.floor(1000 + Math.random() * 9000)}`;

    try {
        console.log(req.body);
       
            const newCoupon = new Coupon({
                name: name,
                couponCode: `${firstname}${randomString}${radomNumber}`,
                activationDate: adate,
                expiresDate: edate,
                discountAmount: damount,
                limit: limit,
            })
            await newCoupon.save();
        res.redirect('/admin/load-coupon');
    } catch (error) {
        console.log(error);
    }
}


module.exports.editCoupon = async (req, res) => {
    try {
        const { name, adate, edate, limit, damount, id } = req.body;

        await Coupon.findByIdAndUpdate({ _id: id }, {
            $set: {
                name: name,
                activationDate: adate,
                expiresDate: edate,
                discountAmount: damount,
                limit: limit,
            }
        })
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
        const coupon = await Coupon.findOne({ couponCode: couponCode });
        if (coupon) {
            const alreadyUsed = coupon.userUsed.find((user) => user === userId);
            console.log(alreadyUsed)
            const count = coupon.limit < coupon.userUsed;
            const limitOfCoupon = coupon.limit === -1 ? false : count;
    
            let dateStrings = [coupon.activationDate, coupon.expiresDate]; // Add your date strings here
            let isoDateStrings = [];
            
            for (let dateString of dateStrings) {
                let dateArray = dateString.split("-");
                let isoDateString = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}T00:00:00.000Z`;
                isoDateStrings.push(isoDateString);
            }
            
            let convertedDates = isoDateStrings.map(dateString => new Date(dateString));
            
            console.log(convertedDates);
            
            const today = new Date();
            console.log(today)
            const active = new Date(coupon.activationDate);
            console.log(active, 'active');
            const expire = new Date(coupon.expiresDate);
            console.log(expire, 'hello');

            if (alreadyUsed) {

                res.json({ used: true, massage: 'This coupon is already used' });

            } else if (limitOfCoupon) {

                res.json({ limit: true, massage: 'Coupon is expried' })

            } else if (!( today >= convertedDates[0] && today <= convertedDates[1] )) {

                res.json({ expired: true, massage: 'Coupon expired' });

            }  else {
              console.log("reached")

                // taking amount 

                const cart = await Cart.findOne({ user: userId });

                let discount = 0;
                let cartAmount = 0
                console.log(coupon.discountAmount, "discount amount")

                if (coupon.percentage) {



                } else if (coupon.discountAmount) {

                      console.log(coupon.discountAmount, cart.products.length )

                    const div = coupon.discountAmount / cart.products.length;
                    discount = Math.round(div);
                    console.log(discount + 'discount', 'div: ' + div)

                }
                    const  total = cart.products.reduce((acc, crr) => acc += crr.totalPrice );
                   cartAmount = cart.products.reduce((acc, crr) => {
                    console.log(crr)
                    if (crr.totalPrice >= discount) {
                        return acc += (crr.totalPrice - discount)
                    } else {

                        return acc += crr.totalPrice;

                    }

                }, 0);

                  if (total <= 500) {

                    res.json({ min: true, massage: 'Minimum ₹500 needed' });
    
                } else {

                    res.json({ success: true, subtotal: cartAmount });


                }



                
            }

        } else {

            res.json({ notAvailable: true, massage: 'No coupon  available' });

        }








    } catch (error) {
        console.log(error);
    }
}

module.exports.loadMyCoupon = async(req, res) => {
    try {
        const coupon = await Coupon.find();
        res.render('myCoupon', { coupon: coupon });
    } catch (error) {
        console.log(error);
    }
}