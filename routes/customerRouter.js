const express = require('express');
const { string } = require('joi');
const Joi = require('joi');
const { getAllCustomers, addCustomer, updateCustomer, customerById, deleteCustomerById, deleteAllCustomers } = require('../services/customer');
const apiDebugger = require('debug')('app:genre-api');



const router = express.Router();

// Get all genres
router.get('/', async (req, res) => {
    const customersList = await getAllCustomers();
    if (customersList.length === 0) {
        return res.status(404).send('No customer found.')
    }
    res.send(customersList);
});

// Add new genre
router.post('/', async (req, res) => {
    // input validation
    const result = validate(req.body.name, req.body.phone);
    if (result.error) {
        return res.send(result.error);
    }
    try {
        const customer = await addCustomer(req.body.name, req.body.isGold, req.body.phone)
        apiDebugger("new customer: ", customer);
        res.send(customer);
    } catch (error) {
        apiDebugger(error);
        res.send(error);
    }
});

// Get genre by ID
router.get('/:id', async (req, res) => {

    try {
        const customer = await customerById(req.params.id);
        if (!customer) {
            return res.status(400).send('Customer with given id is not found.');
        }
        res.send(customer);
    } catch (error) {
        apiDebugger('Error: ', error);
        res.send(error);
    }
});

// delete all documents
router.delete('/delete_all', async (req, res) => {
    try {
        const result = await deleteAllCustomers();
        res.send(result);
    } catch (error) {
        apiDebugger(error);
        res.send(error);
    }

});

// delete genre
router.delete('/:id', async (req, res) => {
    try {
        const deletedCustomer = await deleteCustomerById(req.params.id);
        res.send(deletedCustomer);
    } catch (error) {
        apiDebugger(error);
        res.send(error);
    }
});


// update genre
router.put('/:id', async (req, res) => {
    // input validation
    const result = validate(req.body.name);
    if (result.error) {
        return res.send(result.error);
    }
    try {
        const customer = await updateCustomer(req.params.id, req.body.name, req.body.isGold, req.body.phone);
        apiDebugger(`Updated customer: \n${customer}`);
        if (!customer) {
            return res.status(400).send('Genre with given id is not found.')
        }
        res.send(customer);
    } catch (error) {
        apiDebugger(error);
        res.send(error);
    }

});


function validate(name, phone) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required(),
        phone: Joi.string()
            .pattern(/^[0-9]+$/)
    })
    return schema.validate({ name: name, phone: phone });
}

module.exports = router;