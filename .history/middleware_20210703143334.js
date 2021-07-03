module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isauthenticated()) {
        req.flash('error', 'You must be signed in!')
        return res.redirect('/login')
    }
    next()
}