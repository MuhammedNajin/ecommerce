const mongoose = require('mongoose');
const { array } = require('../middleware/multer');


const wallet = mongoose.Schema({
     
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },

    amount: {
        type: Number,
        default: 0,
    },

    walletHistory: {
        type: Array,

    }

});


module.exports = mongoose.model('wallet', wallet);