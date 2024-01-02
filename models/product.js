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
    variant : [
        {
            price: {
                type: Number,
                required: true
            },
            offerPrice: {
                type: Number,
                required: true
            },
            color: {
                type: String,
                required: true
            },
            size: {
                type: String,
                required: true
            },
            images: [
                {
                    image1: {
                        type: String,
                        required: true
                    },
                    image2: {
                        type: String,
                        required: true
                    },
                    image3: {
                        type: String,
                        required: true
                    },
                    image4: {
                        type: String,
                        required: true
                    },
                }
            ],
            stock: {
                type: Number,
                default: 1
            },

            created: {
                type: Date,
                default: Date.now
            },
        },

    ]
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
