// Express Settings
const express = require('express')
const router = express.Router()

// User imports
const passport = require('passport')
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')

const users = require('../controllers/users')

router.route('/register')
    .get(users.renderRegisterForm) // register form
    .post(catchAsync(users.register)) // When client sumbit register form


router.route('/login')
    .get(users.renderLogin) // Login form
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

// logout from passport session
router.get('/logout', users.logout)

module.exports = router