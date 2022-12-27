const { Genre } = require('../models/models');

async function getAllGenres() {
    return await Genre
        .find()
        .sort('name')
        .select({ id: 1, name: 1 });
}

async function addGenre(name) {
    const genre = new Genre({ name: name });
    return await genre.save();
}

async function updateGenre(id, name) {
    return await Genre
        .findByIdAndUpdate(id,
            {
                $set: {
                    name: name
                }
            }
        )
        .select({ id: 1, name: 1 })
}

async function genreById(id) {
    return await Genre
        .findById({ _id: id })
        .select({ id: 1, name: 1 });
}

async function deleteById(id) {
    return await Genre
        .findByIdAndRemove({ _id: id })
        .select({ id: 1, name: 1 });
}

async function deleteAll() {
    return await Genre
        .remove({});
}

module.exports = { addGenre, getAllGenres, updateGenre, genreById, deleteById, deleteAll }
