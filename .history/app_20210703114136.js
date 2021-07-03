// Base Modules
const express = require('express'), app = express()
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const flash = require('connect-flash')

const session = require('express-session')

// Error handlers
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const {campgroundSchema, reviewSchema} = require('./schemas.js')

// DB CONNECTION
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Review = require('./models/review')

// Routes Connection
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

// DB Creating Connection
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('** 2. Database Connected Successfully!');
})
// -------------- Done.

// View Model
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)

app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

// --------------------------------------------
// ------------ Routes ------------------------
// --------------------------------------------

// Using campground Router()
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

// index.js
app.get('/', (req, res) => {
    res.redirect('/campgrounds')
})

app.get('/fakeUser', async (req, res) => {
const user = new User({email: 'itzik@fdsfds.com', username: 'itzik123'})
const newUser = await User.register(user, '123')
res.send(newUser)
})

// Reviews ----------------------------------------------------------------


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    // = defaults.
    const {statusCode = '500'} = err
    if(!err.message) err.message = 'Something were wrong'
    res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log('** 1. Server Up and Running Sucessfully!')
})