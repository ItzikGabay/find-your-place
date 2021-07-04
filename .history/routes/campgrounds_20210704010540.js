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

// campgrounds/new - create
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

// campgrounds/:id - show
router.get('/:id', catchAsync(campgrounds.showCampground))

// campgrounds/:id/edit - edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampground))

// campgrounds/:id/edit - edit POST
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

// campgrounds/:id - DELETE
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


module.exports = router