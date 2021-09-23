// Express Settings
const express = require('express')
const router = express.Router({mergeParams: true})

// Middleware's for errors
const catchAsync = require('../utils/catchAsync')

// Model & more
const campgrounds = require('../controllers/campground')
const Campground = require('../models/campground')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')

const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })


router.route('/')
    .get(catchAsync(campgrounds.index)) // show index
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground)) // creating a campground
    // .post(upload.array('image'), (req, res) => {
    //     res.send(req.body, req.files)
    // })


// campgrounds/new - create 
// (Must be before of /:id, otherwise it will take '/new' as an undfined ID)
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground)) // campgrounds/:id - show
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground)) // campgrounds/:id/edit - edit POST
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)) // campgrounds/:id - DELETE



// campgrounds/:id/edit - edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampground))

module.exports = router