// Base Modules
const express = require('express'), app = express()
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

// Passport User Authethication
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

// Flash messages
const flash = require('connect-flash')
const session = require('express-session')

// Error handlers
const ExpressError = require('./utils/ExpressError')

// DB Settings & Connections
const mongoose = require('mongoose')

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

// Routes Connection
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')

// App Settings
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)

// Public Directory for files
app.use(express.static(path.join(__dirname, 'public')))

// Session settings
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

// Passport initilization
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// App Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})

// Using campground Router()
app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

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