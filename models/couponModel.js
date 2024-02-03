
const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    couponCode: {
        type: String,
        required: true,
    },
    activationDate: {
        type: String,
        required: true,
    },
    expiresDate: {
        type: String,
        required: true,
    },
    discountAmount: {
        type: Number,  
    },
    percentage: {
        type: String,
    },
    userUsed: {
        type: Array,
        ref: 'User',
        default: [],
    },
    limit: {
        type: Number,
        default: -1,
    },
    active: {
        type: Boolean,
        default: false,
    }
    
});

module.exports = mongoose.model('Coupon', couponSchema);