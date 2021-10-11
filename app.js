// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }
require('dotenv').config()

// Base Modules
const express = require('express'), app = express()
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");

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
// const MongoStore = require('connect-mongo');
const MongoStore = require('connect-mongo');
const db_url = process.env.DB_URL;

mongoose.connect(db_url, {
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
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)

// MONGODB Injection Security
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);

// This sets custom options for the `referrerPolicy` middleware.
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/itzikdevio/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// Public Directory for files
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET;

const store = MongoStore.create({
    mongoUrl: db_url,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    },
});

store.on("error", function (e) {
    console.log('ERROR:', e);
});



// Session settings
const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // only in deploy - to allow https only:
        // secure: true,
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
    res.render('home');
})

// Reviews ----------------------------------------------------------------

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    // = defaults.
    const { statusCode = '500' } = err
    if (!err.message) err.message = 'Something were wrong'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT

app.listen(port, () => {
    console.log('** 1. Server Up and Running Sucessfully!')
})