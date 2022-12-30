const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = mongoose.Schema({
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
    isAdmin: Boolean
});

// we are encapsulating the logic here in a function inside the model
userSchema.methods.generatAuthToken = function () {
    return jwt.sign({ // this will generate the json web token.
        _id: this.id,   // this refers to current object
        email: this.email,
        isAdmin: this.isAdmin
    }, config.get('jwtPrivateKey')); // private key set in environment variable for signing the token.

}

const User = mongoose.model('User', userSchema);

module.exports = { User };