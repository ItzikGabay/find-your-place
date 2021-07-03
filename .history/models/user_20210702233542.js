const mongoose = require('mongoose')
const Schema = mongoose.schema;
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email: {
        type: String, 
        required: true
    }
})
