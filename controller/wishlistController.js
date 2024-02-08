const Wishlist = require('../models/wishlistModel');


module.exports.loadWhislist = (req, res) => {
    try {
        res.render('wishlist')
    } catch (error) {
        console.log(error);
    }
}

module.exports.addTOWhishlist = async (req, res) => {
    try {

        console.log('recived');

        const userId = req.session.user?._id;
        const wishlist = await Wishlist.findOne({ user: userId })
        const { productId } = req.body;
        if (wishlist) {

            const exists = wishlist.filter((el) => el.products === productId);

            if (!exists) {
                await Wishlist.updateOne({ user: userId }, {

                    $push: {
                        products: productId,
                    }

                })
            } else {
                res.json({ already: true, });
            }
        } else {
            const data = {
                productId: productId
            }
            const newWishlist = new Wishlist({
                user: userId,
                products: data,
            })

            await newWishlist.save();

        }
        res.json({ wishlist: true });

    } catch (error) {
        console.log(error);
    }
}

module.exports.removeWishlist = async (req, res) => {
    try {
        const userId = req.session.user?._id;
        if (userId) {
            const { productId } = req.body;
            await Wishlist.findOneAndUpdate({ 'products.productId': productId }, {
                $pull: {
                    products: productId
                }

            })
            res.json({ seccess: true });
        }

    } catch (error) {
        console.log(error)
    }
}