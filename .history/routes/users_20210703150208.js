const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const {email, username, password} = req.body
        const user = await new User({email, username})
        const registerdUser = await User.register(user, password)
        req.login(registerdUser, err => {
            if(err) return next(err)
            req.flash('success', 'Welcome to YelpCamp')
            res.redirect('/campgrounds')
        })
    }
    catch(e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))


router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'You login successfully')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete 
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'You have logged out')
    res.redirect('/campgrounds')
})

module.exports = router