const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    mobile: {
        type: String,
        required: true
    },
    
    password: {
        type: String,
        required: true
    },

    isAdmin: {
        type: Boolean,
        required: true
    },

    isBlocked: {
         type: Boolean,
    },

    verified: {
        type: Boolean
    },

    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);