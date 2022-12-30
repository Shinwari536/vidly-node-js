const bcrypt = require('bcrypt');
const { User } = require('../models/userModel');

async function authenticate(userObj) {
    let user = await User.findOne({ email: userObj.email });
    if (!user) throw new InvalideEmailPassword('Invalide email or password.');

    const validPassword = await bcrypt.compare(userObj.password, user.password);
    if (!validPassword) throw new InvalideEmailPassword('Invalide email or password.');

    return user;
}


function InvalideEmailPassword(message) {
    this.message = message;
    this.name = 'InvalideEmailPassword';
}

module.exports = { authenticate };