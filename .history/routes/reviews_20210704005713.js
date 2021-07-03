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
router.delete('/:reviewId', isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router