const express = require('express');
const Joi = require('joi');
const _ = require('lodash');
const config = require('config');
const jwt = require('jsonwebtoken'); // for generating the json web token.
const apiDebugger = require('debug')('app:auth-api');
const { authenticate } = require('../services/auth');

const router = express.Router();


// Authenticate user
router.post('/', async (req, res) => {
    // input validation
    const result = validate(req.body);
    if (result.error) {
        apiDebugger('validation error')
        return res.status(400).send(result.error);
    }
    const user = await authenticate(_.pick(req.body, ['email', 'password']));
    if (user) {
        // get auth token
        const token = user.generatAuthToken();
        apiDebugger("Authenticated user: ", { user: _.pick(user, ['name', 'email']), token: token });
        res.header('x-auth-token', token).send({ user: _.pick(user, ['name', 'email']) });
        // when sending a custome header you have to prefix it with `x-` 
        // i.e. `x-auth-token`
    }
    // try {
    //     const user = await authenticate(_.pick(req.body, ['email', 'password']));
    //     if (user) {
    //         // get auth token
    //         const token = user.generatAuthToken();
    //         apiDebugger("Authenticated user: ", {user: _.pick(user, ['name', 'email']), token: token});
    //         res.header('x-auth-token', token).send({user: _.pick(user, ['name', 'email'])});
    //         // when sending a custome header you have to prefix it with `x-` 
    //         // i.e. `x-auth-token`
    //     }
    // } catch (error) {
    //     apiDebugger("Exception: ", error);
    //     res.status(400).send(error);
    // }
});



function validate(user) {
    const schema = Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,10}$'))
            .required(),
    })
    return schema.validate(user);
}

module.exports = router;