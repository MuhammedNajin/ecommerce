const Wallet = require('../models/walletModal');
const Cart = require('../models/cartModel');


module.exports.loadData = async (req, res, next) => {
    req.session.user
        res.locals.wallet = req.session.user ? await Wallet.findOne({user: req.session.user?._id}) : null;
        res.locals.cart = req.session.user ? await Cart.findOne({ user: req.session.user?._id }, { products: 1 }) : null;
      
    next()
}