const express = require('express');
const Joi = require('joi');
const { addGenre, getAllGenres, updateGenre, genreById, deleteById, deleteAll } = require('../services/genre');
const authorization = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const apiDebugger = require('debug')('app:genre-api');
const NotFound = require('../helper/helpers');
// 

const router = express.Router();

// Get all genres
router.get('/', asyncMiddleware(async (req, res) => {
    const genresList = await getAllGenres();
    if (genresList.length === 0) throw new NotFound('Genre not found.');
    res.send(genresList);
}));

// Add new genre
/*
    User of Middleware

    .post('route string', [optional middleware], callbackFuntion);
    we are are passing `authorization` as middleware here.
    you can pass it in any method that you want to protect.

*/
router.post('/', [authorization, isAdmin], asyncMiddleware(async (req, res) => {
    // input validation
    const result = validate(req.body.name);
    if (result.error) {
        return res.send(result.error);
    }
    apiDebugger(req.user);
    const genre = await addGenre(req.body.name)
    apiDebugger("new genre: ", genre);
    res.send(genre);

    // apiDebugger(error);
    // res.status(400).send(error);

}));

// Get genre by ID
router.get('/:id', async (req, res) => {
    const genre = await genreById(req.params.id);
    if (!genre) throw new NotFound('Genre with the given id was not found.')
    res.send(genre);
    // apiDebugger('Error: ', error);
    // res.status(400).send(error);

});

// delete all documents
router.delete('/delete_all', [authorization, isAdmin], async (req, res) => {
    const result = await deleteAll();
    res.send(result);
    // apiDebugger(error);
    // res.status(400).send(error);

});

// delete genre
router.delete('/:id', [authorization, isAdmin], async (req, res) => {
    const deletedGenre = await deleteById(req.params.id);
    if (!deletedGenre) throw new NotFound('Genre with the given id was not found')
    res.send(deletedGenre);
    // apiDebugger(error);
    // res.send(error);

});


// update genre
router.put('/:id', [authorization, isAdmin], async (req, res) => {
    // input validation
    const result = validate(req.body.name);
    if (result.error) {
        return res.send(result.error);
    }
    const genre = await updateGenre(req.params.id, req.body.name);
    // apiDebugger(`Updated genre: ${genre}`);
    if (!genre) throw new NotFound('Genre with the given id was not found')
    res.send(genre);
    // apiDebugger(error);
    // res.send(error);

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