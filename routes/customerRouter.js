const express = require('express');
const Joi = require('joi');
const apiDebugger = require('debug')('app:genre-api');
const { getAllCustomers, addCustomer, updateCustomer, customerById, deleteCustomerById, deleteAllCustomers } = require('../services/customer');



const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
    const customersList = await getAllCustomers();
    if (customersList.length === 0) {
        return res.status(404).send('No customer found.')
    }
    res.send(customersList);
});

// Add new customer
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
        res.status(400).send(error);
    }
});

// Get customer by ID
router.get('/:id', async (req, res) => {

    try {
        const customer = await customerById(req.params.id);
        if (!customer) {
            return res.status(400).send('Customer with given id is not found.');
        }
        res.send(customer);
    } catch (error) {
        apiDebugger('Error: ', error);
        res.status(400).send(error);
    }
});

// delete all documents
router.delete('/delete_all', async (req, res) => {
    try {
        const result = await deleteAllCustomers();
        res.send(result);
    } catch (error) {
        apiDebugger(error);
        res.status(400).send(error);
    }

});

// delete customer
router.delete('/:id', async (req, res) => {
    try {
        const deletedCustomer = await deleteCustomerById(req.params.id);
        if (!deletedCustomer) {
            return res.status(400).send('Customer with given id is not found.')
        }
        res.send(deletedCustomer);
    } catch (error) {
        apiDebugger(error);
        res.status(400).send(error);
    }
});


// update customer
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
            return res.status(400).send('Customer with given id is not found.')
        }
        res.send(customer);
    } catch (error) {
        apiDebugger(error);
        res.status(400).send(error);
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