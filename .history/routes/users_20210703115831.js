const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', async (req, res) => {
    const {email, username, password} = req.body
    const user = await new User({email, username})
    const registerdUser = await User.register(user, password)
    req.flash('Welcome to YelpCamp  ')
    res.redirect('/campgrounds')
})
module.exports = router