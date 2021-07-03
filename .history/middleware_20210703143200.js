module.exports.isLoggedIn = (req, res, next) => {
    if (!is.authenticated()) {
        req.flash('error', 'You must be signed in!')
        return res.redirect('/login')
    }
    next()
}