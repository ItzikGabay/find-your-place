if (!is.authenticated()) {
    req.flash('error', 'You must be signed in!')
    return res.redirect('/login')
}