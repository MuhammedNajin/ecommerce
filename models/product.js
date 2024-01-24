const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cetagory: {
        type: String,
        required: true,
        ref: 'cetagory',
    },
    isListed: {
       type: Boolean,
       default: true,
    },
    brand: {
        type: String,
        required: true,
    },
    variant: [
      {
        price: {
          type: Number,
          required: true,
        },
        offerPrice: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        size: {
          type: Array,
          required: true,
        },
        images: {
          type: Array,
          validate: [arrayLimit, 'should be four images'],
        },
        stock: {
          type: Number,
          default: 1,
        },
        created: {
          type: Date,
          default: Date.now,
        },
      }
    ],
});


function arrayLimit(val){
    return val.length <= 4;
}
module.exports = mongoose.model('Product', ProductSchema);


