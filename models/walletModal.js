const mongoose = require('mongoose');


const wallet = mongoose.Schema({
     
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },

    amount: {
        type: Number,
        default: 0,
    }

});


module.exports = mongoose.model('wallet', wallet);