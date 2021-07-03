const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

// Schema for passport

const UserSchema = new Schema({
    email: {
        type: String, 
        required: true,
        unique: true
    }
})

// Activating the Schema
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)