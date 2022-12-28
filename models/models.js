const mongoose = require('mongoose');

const genreSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
})
const Genre = mongoose.model('Genre', genreSchema);

const Customer = mongoose.model('Customer', mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    phone: Number,
    isGold: Boolean

}));


const Movie = mongoose.model('Movie', mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 255,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    genre: {
        type: genreSchema,
        required: true,
        min: 0,
        max: 255
    }

}))

module.exports = { Genre, Customer, Movie };