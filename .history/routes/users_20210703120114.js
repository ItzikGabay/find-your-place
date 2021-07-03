const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    const {email, username, password} = req.body
    const user = await new User({email, username})
    const registerdUser = await User.register(user, password)
    console.log(registerdUser)
    req.flash('success', 'Welcome to YelpCamp')
    res.redirect('/campgrounds')
}))

module.exports = router