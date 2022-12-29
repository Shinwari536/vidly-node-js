const express = require('express');
const Joi = require('joi');
const { newRental, getAllRentals, getRentalById } = require('../services/rental')
const apiDebugger = require('debug')('app:rental-api');

const router = express.Router();


// create new rental
router.post('/', async (req, res) => {
    const result = validate(req.body);
    if (result.error) {
        return res.status(400).send(result.error)
    }

    try {
        const rental = await newRental(req.body.customerId, req.body.movieId);
        apiDebugger("new rental: ", rental);
        res.send(rental);
    } catch (error) {
        apiDebugger("Exception: ", error);
        res.status(400).send(error);
    }
});

// get all rentals
router.get('/', async(req, res) => {
    try {
        const rentalList = await getAllRentals();
        if (rentalList.length === 0) {
            return res.status(404).send('No rental found.')
        }
        res.send({rentals: rentalList});
    } catch (error) {
        apiDebugger(error);
        res.status(400).send(error);
    }
})


// get rental by id
router.get('/:id', async(req, res) => {
    try {
        const rental = await getRentalById(req.params.id);
        res.send({rental: rental});
    } catch (error) {
        apiDebugger(error);
        res.status(400).send(error);
    }
}) 

function validate(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })
    return schema.validate({ customerId: rental.customerId, movieId: rental.movieId });
}

module.exports = router;
