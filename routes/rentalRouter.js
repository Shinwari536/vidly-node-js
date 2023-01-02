const express = require('express');
const Joi = require('joi');
const { newRental, getAllRentals, getRentalById } = require('../services/rental');
const NotFound = require('../helper/helpers');
const apiDebugger = require('debug')('app:rental-api');

const router = express.Router();


// create new rental
router.post('/', async (req, res) => {
    const result = validate(req.body);
    if (result.error) {
        return res.status(400).send(result.error)
    }
    const rental = await newRental(req.body.customerId, req.body.movieId);
    apiDebugger("new rental: ", rental);
    res.send(rental);
    // apiDebugger("Exception: ", error);
    // res.status(400).send(error);

});

// get all rentals
router.get('/', async (req, res) => {
    const rentalList = await getAllRentals();
    if (rentalList.length === 0) throw new NotFound('No rental was found')
    res.send({ rentals: rentalList });
    // apiDebugger(error);
    // res.status(400).sed(error);

})


// get rental by id
router.get('/:id', async (req, res) => {
    const rental = await getRentalById(req.params.id);
    if(!rental) throw new NotFound('Rental with the given id was not found')
    res.send({ rental: rental });
    // apiDebugger(error);
    // res.status(400).send(error);

})



function validate(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })
    return schema.validate({ customerId: rental.customerId, movieId: rental.movieId });
}

module.exports = router;
