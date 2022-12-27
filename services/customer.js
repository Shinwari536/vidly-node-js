const { Customer } = require('../models/models');

async function getAllCustomers() {
    return await Customer
        .find()
        .sort('name')
        .select({ id: 1, name: 1, isGold: 1, phone: 1 });
}

async function addCustomer(name, isGold, phone) {
    const customer = new Customer({
        name: name,
        isGold: isGold,
        phone: phone
    });
    return await customer.save();
}

async function updateCustomer(id, name, isGold, phone) {
    return await Customer
        .findByIdAndUpdate(id,
            {
                $set: {
                    name: name,
                    isGold: isGold,
                    phone, phone
                }
            }
        )
        .select({ id: 1, name: 1, isGold: 1, phone: 1 })
}

async function customerById(id) {
    return await Customer
        .findById({ _id: id })
        .select({ id: 1, name: 1, isGold: 1, phone: 1 });
}

async function deleteCustomerById(id) {
    return await Customer
        .findByIdAndRemove({ _id: id })
        .select({ id: 1, name: 1, isGold: 1, phone: 1 });
}

async function deleteAllCustomers() {
    return await Customer
        .remove({});
}

module.exports = { getAllCustomers, addCustomer, updateCustomer, customerById, deleteCustomerById, deleteAllCustomers }
