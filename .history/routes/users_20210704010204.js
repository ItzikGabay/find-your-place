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
router.post('/register', catchAsync(users.register))


// Login form
router.get('/login', users.renderLogin)

// When client sumbit login form ->
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

// logout from passport session
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'You have logged out')
    res.redirect('/campgrounds')
})

module.exports = router