const bcrypt = require('bcrypt');
const { User } = require('../models/userModel');


async function getAllUsers() {
    return await User
        .find()
        .sort('name')
        .select('-__v -password');
}

async function register(userObj) {
    let user = await User.findOne({email: userObj.email});
    if (user) {
        throw new UserExist('User with given email already registered.');
    }
    user = new User(userObj);
    // hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(user.password, salt);
    user.password = hashed;
    
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
        .select('-__v -password');
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
