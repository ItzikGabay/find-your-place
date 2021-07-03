const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res, next) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}
