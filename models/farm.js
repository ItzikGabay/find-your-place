const mongoose = require('mongooe')
const {Schema} = mongoose;


const farmSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'Farm must have a name!']
    },
    city: { 
        type: String
    },
    email: { 
        type: String, 
        required: [true, 'Email required']
    },
    products: []
})