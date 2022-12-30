const express = require('express');
const Joi = require('joi');
const _ = require('lodash');
const apiDebugger = require('debug')('app:user-api');
const { getAllUsers, register, updateUser, userById } = require('../services/user');
const authorization = require('../middleware/authMiddleware');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const userList = await getAllUsers();
        if (userList.length === 0) {
            return res.status(404).send('No customer found.')
        }
        res.send(userList);
    } catch (error) {
        apiDebugger(error);
        res.status(400).send(error);
    }
});

// Add new user
router.post('/', async (req, res) => {
    // input validation
    const result = validate(req.body);
    if (result.error) {
        apiDebugger('validation error')
        return res.send(result.error);
    }
    try {
        const user = await register(_.pick(req.body, ['name', 'email', 'password']));
        apiDebugger("new user: ", user);
        res.send(_.pick(user, ['_id', 'name', 'email']));
    } catch (error) {
        apiDebugger("Exception: ", error);
        res.status(400).send(error);
    }
});

// Get user by ID
router.get('/me', authorization, async (req, res) => {

    try {
        // authorization is the middleware, so we can have `req.user` (to get userId) from middleware
        const user = await userById(req.user._id);
        if (!user) {
            return res.status(400).send('User with given id is not found.');
        }
        res.send(user);
    } catch (error) {
        apiDebugger('Error: ', error);
        res.status(400).send(error);
    }
});

// update user
router.put('/:id', async (req, res) => {
    // input validation
    const result = validate(req.body);
    if (result.error) {
        return res.send(result.error);
    }
    try {
        const user = await updateUser(req.params.id, req.body.name, req.body.email, req.body.password);
        apiDebugger(`Updated user: \n${user}`);
        if (!user) {
            return res.status(400).send('User with given id is not found.')
        }
        res.send(user);
    } catch (error) {
        apiDebugger(error);
        res.status(400).send(error);
    }

});


function validate(user) {
    const schema = Joi.object({
        name: Joi.string()
            .min(2)
            .required(),
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,10}$'))
            .required(),
        // repeat_password: Joi.ref('password'),
    })
    return schema.validate(user);
}

module.exports = router;