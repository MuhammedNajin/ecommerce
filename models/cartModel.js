const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product',
            },
            product: {
                type: String,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
            totalPrice: {
                type: Number,
                required: true,
            },
            size: {
                type: String
            }
        }
    ],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
