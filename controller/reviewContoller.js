const Review = require('../models/reviewModal');

module.exports.addReview = async(req, res) => {
    try {
        console.log(req.body);
        const userId = req.session.user?._id;
        const { productId, rating, ureview } = req.body;
        if(userId) {
            const review = await Review.findOne({user: userId, productId: productId});
            if(review) {
                return Review.updateOne({user: userId, productId: productId}, {
                    $set: {
                        rating: rating,
                        review: ureview,
                        date: Date.now(),
                    }
                })
                .then(() => {
                    res.json({ success: true });
                })
            } else {
                const newReview = new Review({
                    user: userId,
                    productId: productId,
                    review: ureview,
                    rating: parseInt(rating),
                })
                return newReview.save()
                .then(() => {
                    res.json({ success: true })
                })
                .catch( (err) => {
                    console.log(err);
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
}