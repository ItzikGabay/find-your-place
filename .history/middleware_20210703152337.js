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