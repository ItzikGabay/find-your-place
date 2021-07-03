// Express Settings
const express = require('express')
const router = express.Router({mergeParams: true})

// Models
const Campground = require('../models/campground')
const Review = require('../models/review')

// Error handlers
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const {reviewSchema} = require('../schemas.js')
const { validateReview, isLoggedIn } = require('../middleware')

// When posting a review
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created new review')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// When deleting a review
router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfuly deleted review')
    res.redirect(`/campgrounds/${id}`)
}))


module.exports = router