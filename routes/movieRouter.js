const express = require('express');
const Joi = require('joi');
const apiDebugger = require('debug')('app:movie-api');
const { addMovie, getAllMovies, getMovieById, updateMovie, deletMovie } = require('../services/movie')


const router = express.Router();

// add new movie
router.post('/', async (req, res) => {
    try {
        const result = validate(req.body);
        if (result.error) {
            return res.send(result.error);
        }
        
        const movie = await addMovie(req.body.title, req.body.numberInStock, req.body.dailyRentalRate, req.body.genreId);
        res.send(movie);
        
    } catch (ex) {
        apiDebugger("Exception: ", ex);
        res.status(400).send(ex);
    }
})

// Get all movies
router.get('/', async (req, res) => {
    try {
        const moviesList = await getAllMovies();
        if (moviesList.length === 0) {
            return res.status(404).send('No movie found.')
        }
        res.send(moviesList);
    } catch (ex) {
        apiDebugger(ex);
        res.status(400).send(ex);
    }
});

// Get all movies
router.get('/:id', async (req, res) => {
    try {
        const movie = await getMovieById(req.params.id);
        if (!movie) {
            return res.status(400).send('Movie with given id is not found.');
        }
        res.send(movie);
    } catch (ex) {
        apiDebugger(ex);
        res.status(400).send(ex);
    }
});

// update movie
router.put('/:id', async (req, res) => {
    try {
        const result = validate(req.body);
        if (result.error) {
            return res.send(result.error);
        }
        // call update here
        const movie = await updateMovie(req.params.id, req.body.title, req.body.numberInStock, req.body.dailyRentalRate, req.body.genreId);
        console.log(movie);
        res.send(movie);
    } catch (ex) {
        apiDebugger("Exception: ", ex);
        res.status(400).send(ex);
    }
})


// Delete movie
router.delete('/:id', async (req, res) => {
    try {
        const movie = await deletMovie(req.params.id);
        if (!movie) {
            return res.status(400).send('Movie with given id is not found.')
        }
        res.send(movie);
    } catch (ex) {
        apiDebugger(ex);
        res.status(400).send(ex);
    }
});

// validate user input
function validate(movie) {
    const schema = Joi.object({
        title: Joi.string()
            .min(1)
            .required(),
        numberInStock: Joi.number(),
        dailyRentalRate: Joi.number(),
        genreId: Joi.objectId()
            .min(24)
            .max(24)
            .required(),
    })
    return schema.validate(movie);
}

module.exports = router;

