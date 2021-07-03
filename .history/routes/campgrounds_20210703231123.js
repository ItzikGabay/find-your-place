// Express Settings
const express = require('express')
const router = express.Router({mergeParams: true})

// Middleware's for errors
const catchAsync = require('../utils/catchAsync')

// Model & more
const Campground = require('../models/campground')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')


// campgrounds.js - main route
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}))

// campgrounds/new - create
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

// campgrounds/:id - show
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews', 
        
    }).populate('author')
    console.log(campground)
    if(!campground){
        req.flash('error', 'Cannot find campground!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}))

// campgrounds/:id/edit - edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'Cannot find campground!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}))

// campgrounds - post (create)
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError('Invalid campground data', 400)
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id;
    await campground.save()
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

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