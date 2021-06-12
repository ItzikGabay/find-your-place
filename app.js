// Base Modules
const express = require('express'), app = express()
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const joi = require('join')

// Error handlers
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

// DB CONNECTION
const Campground = require('./models/campground')
const mongoose = require('mongoose')
const Joi = require('joi')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('** 2. Database Connected Successfully!');
})
// -------------- Done.

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)


// --------------------------------------------
// ------------ Routes ------------------------
// --------------------------------------------

// index.js
app.get('/', (req, res) => {
    res.redirect('/campgrounds')
})

// campgrounds.js - main route
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}))

// campgrounds/new - create
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

// campgrounds/:id - show
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {campground})
}))

// campgrounds/:id/edit - edit
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {campground})
}))

// campgrounds - post (create)
app.post('/campgrounds', catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError('Invalid campground data', 400)
    const campgroundSchema = Join.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0)
        }).required()
    })
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressErrorresu(result.error.details, 400)
    }
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    // = defaults.
    const {statusCode = '500'} = err
    if(!err.message) err.message = 'Something were wrong'
    res.status(statusCode).render('error', {err})
    res.send('Oh boy!')
})

app.listen(3000, () => {
    console.log('** 1. Server Up and Running Sucessfully!')
})