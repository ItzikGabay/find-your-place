// Express Settings
const express = require('express')
const router = express.Router({mergeParams: true})

// Middleware's for errors
const catchAsync = require('../utils/catchAsync')

// Model & more
const campgrounds = require('../controllers/campground')
const Campground = require('../models/campground')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')


// campgrounds.js - main route
router.get('/', catchAsync(campgrounds.index))

// campgrounds/new - create
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

// campgrounds - post (create)
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

// campgrounds/:id - show
router.get('/:id', catchAsync(campgrounds.showCampground))

// campgrounds/:id/edit - edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampground))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params

    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    camp.save()
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))


router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfuly deleted campground')
    res.redirect('/campgrounds')
}))


module.exports = router