const _ = require('loadash');
const { User } = require('../models/userModel');


async function getAllUsers() {
    return await User
        .find()
        .sort('name')
        .select('-__v');
}

async function register(name, email, password) {
    let user = await User.findOne({email: email});
    if (user) {
        throw new UserExist('User with given email already registered.');
    }
    user = new User({
        name: name,
        email: email,
        password: password
    });
    return await user.save();
}

async function updateUser(id, name, email) {
    return await User
        .findByIdAndUpdate(id,
            {
                $set: {
                    name: name,
                    email: email,
                }
            }
        )
        .select({ id: 1, name: 1, isGold: 1, phone: 1 })
}

async function userById(id) {
    return await User
        .findById({ _id: id })
        .select('-__v');
}

// async function deleteCustomerById(id) {
//     return await User
//         .findByIdAndRemove({ _id: id })
//         .select({ id: 1, name: 1, isGold: 1, phone: 1 });
// }

// async function deleteAllCustomers() {
//     return await User
//         .remove({});
// }

function UserExist(message) {
    this.message = message;
    this.name = 'UserAlreadyExistException'
}

module.exports = { getAllUsers, register, updateUser, userById }
