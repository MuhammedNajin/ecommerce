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
    variant: {
        type: Array,
        required: true,
        fields: [
          {
            name: 'price',
            type: Number,
            required: true
          },
          {
            name: 'offerPrice',
            type: Number,
            required: true
          },
          {
            name: 'color',
            type: String,
            required: true
          },
          {
            name: 'size',
            type: Array,
            required: true
          },
          {
            name: 'images',
            type: Array,
            validate: [arrayLimit, 'should be four images']
          },
          {
            name: 'stock',
            type: Number,
            default: 1
          },
          {
            name: 'created',
            type: Date,
            default: Date.now
          }
        ]
      }
});


function arrayLimit(val){
    return val.length <= 4;
}
module.exports = mongoose.model('Product', ProductSchema);


