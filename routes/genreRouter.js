const express = require('express');
const Joi = require('joi');
const { addGenre, getAllGenres, updateGenre, genreById, deleteById, deleteAll } = require('../services/genre');
const authorization = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const apiDebugger = require('debug')('app:genre-api');



const router = express.Router();

// Get all genres
router.get('/', async (req, res) => {
    const genresList = await getAllGenres();
    if (genresList.length === 0) {
        return res.status(404).send('No genre found.')
    }
    res.send(genresList);
});

// Add new genre
/*
    User of Middleware

    .post('route string', [optional middleware], callbackFuntion);
    we are are passing `authorization` as middleware here.
    you can pass it in any method that you want to protect.

*/
router.post('/', [authorization, isAdmin], async (req, res) => { 
    // input validation
    const result = validate(req.body.name);
    if (result.error) {
        return res.send(result.error);
    }
    try {
        apiDebugger(req.user);
        const genre = await addGenre(req.body.name)
        apiDebugger("new genre: ", genre);
        res.send(genre);
    } catch (error) {
        apiDebugger(error);
        res.status(400).send(error);
    }
});

// Get genre by ID
router.get('/:id', async (req, res) => {

    try {
        const genre = await genreById(req.params.id);
        if (!genre) {
            return res.status(400).send('Genre with given id is not found.');
        }
        res.send(genre);
    } catch (error) {
        apiDebugger('Error: ', error);
        res.status(400).send(error);
    }
});

// delete all documents
router.delete('/delete_all', [authorization, isAdmin], async (req, res) => {
    try {
        const result = await deleteAll();
        res.send(result);
    } catch (error) {
        apiDebugger(error);
        res.status(400).send(error);
    }

});

// delete genre
router.delete('/:id', [authorization, isAdmin], async (req, res) => {
    try {
        const deletedGenre = await deleteById(req.params.id);
        if (!deletedGenre) {
            return res.status(400).send('Genre with given id is not found.');
        }
        res.send(deletedGenre);
    } catch (error) {
        apiDebugger(error);
        res.send(error);
    }
});


// update genre
router.put('/:id', [authorization, isAdmin], async (req, res) => {
    // input validation
    const result = validate(req.body.name);
    if (result.error) {
        return res.send(result.error);
    }
    try {
        const genre = await updateGenre(req.params.id, req.body.name);
        apiDebugger(`Updated genre: ${genre}`);
        if (!genre) {
            return res.status(400).send('Genre with given id is not found.')
        }
        res.send(genre);
    } catch (error) {
        apiDebugger(error);
        res.send(error);
    }

});


function validate(name) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required()
    }) 
    return schema.validate({ name: name });
}

module.exports = router;