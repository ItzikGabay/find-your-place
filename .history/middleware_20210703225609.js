const {campgroundSchema} = require('./schemas.js')
const ExpressError = require('./utils/ExpressError') 
const Campground = require('./models/campground')

// Middleware for checking if is logged in by passport module.
//
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl // exp: returnTo = "new/campgrounds"
        req.flash('error', 'You must be signed in!')
        return res.redirect('/login')
    }
    next()
}

// Authorization Middleware
module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You dont have premmision to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

// Middleware for error
module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}