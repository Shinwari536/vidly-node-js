const mongoose = require('mongoose');

const User = mongoose.model('User', mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 256
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024
    },
}));

module.exports = { User };