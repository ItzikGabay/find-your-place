// Express Settings
const express = require('express')
const router = express.Router({mergeParams: true})

// Middleware's for errors
const catchAsync = require('../utils/catchAsync')

// Model & more
const campgrounds = require('../controllers/campground')
const Campground = require('../models/campground')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')


router.route('/')
    .get(catchAsync(campgrounds.index)) // show index
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground)) // creating a campground

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground)) // campgrounds/:id - show
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground)) // campgrounds/:id/edit - edit POST
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)) // campgrounds/:id - DELETE

// campgrounds/new - create
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

// campgrounds/:id/edit - edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampground))

module.exports = router