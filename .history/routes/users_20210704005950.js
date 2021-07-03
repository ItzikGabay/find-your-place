// Express Settings
const express = require('express')
const router = express.Router()

// User imports
const passport = require('passport')
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')

const users = require('../controllers/users')


// register form
router.get('/register', users.renderRegisterForm)

// When client sumbit register form ->
router.post('/register', catchAsync(users.))


// Login form
router.get('/login', (req, res) => {
    res.render('users/login')
})

// When client sumbit login form ->
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'You login successfully')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

// logout from passport session
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'You have logged out')
    res.redirect('/campgrounds')
})

module.exports = router