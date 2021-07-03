// Express Settings
const express = require('express')
const router = express.Router({mergeParams: true})

// Models
const Campground = require('../models/campground')
const Review = require('../models/review')
const reviews = require('../controllers/reviews')

// Error handlers
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const {reviewSchema} = require('../schemas.js')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

// When posting a review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

// When deleting a review
router.delete('/:reviewId', isLoggedIn,isReviewAuthor, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfuly deleted review')
    res.redirect(`/campgrounds/${id}`)
}))


module.exports = router