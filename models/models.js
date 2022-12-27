const mongoose = require('mongoose');

const Genre = mongoose.model('Genre', mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
}));

const Customer = mongoose.model('Customer', mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    phone: Number,
    isGold: Boolean

}))

module.exports = { Genre, Customer };