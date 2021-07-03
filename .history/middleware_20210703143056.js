if (!is.authenticated()) {
    req.flash('error', 'You must be signed in!')
    res.redirect('/login')
}