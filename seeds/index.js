const Campground = require('../models/campground')
const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('** 2. Database Connected Successfully!');
})

const sample = array => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
    await Campground.deleteMany()
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            author: '60e027d2b5f5b19e68d8fe88',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'This is  BEATIFUL Description of how the place should to be and look, so, do you have the money to buy this experience? Click on reserve now!',
            price: random1000,
            geometry: {
                type: 'Point', coordinates:
                    [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/itzikdevio/image/upload/v1632422542/YelpCamp/q5vnqiw8ey3agwevyqxs.png',
                    filename: 'YelpCamp/toifrxswogup0ebzygux'
                },
                {
                    url: 'https://res.cloudinary.com/itzikdevio/image/upload/v1632422542/YelpCamp/q5vnqiw8ey3agwevyqxs.png',
                    filename: 'YelpCamp/x5f5u740gv4q7ibw2mih'
                }
            ]
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})