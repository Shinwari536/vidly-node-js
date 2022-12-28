const { Genre, Movie } = require('../models/models')
const db = require('debug')('app:db');



async function addMovie(title, numberInStock, dailyRentalRate, genreId) {
    const genre = await Genre.findById(genreId);
    if (!genre) {
        throw new NoGenreException('No genre for given id found.');
    }

    const movie = new Movie({
        title,
        numberInStock,
        dailyRentalRate,
        genre: {
            id: genre.id,
            name: genre.name,
        }
    });
    return await movie.save();
}

async function getAllMovies() {
    return await Movie.find()
        .sort('name')
        .select('-__v -genre.__v');
}

async function getMovieById(id) {
    return await Movie.findById(id)
        .sort('name')
        .select('-__v -genre.__v');
}

async function updateMovie(id, title, numberInStock, dailyRentalRate, genreId) {
    const genre = await Genre.findById(genreId);
    if (!genre) {
        throw new NoGenreException('No genre for given id found.');
    }
    return await Movie.findByIdAndUpdate({ _id: id },
        {
            $set: {
                title,
                numberInStock,
                dailyRentalRate,
                genre: {
                    name: genre.name,
                    id: genre.id
                }
            }, new: true
        })
        .select('-__v -genre.__v');
}

async function deletMovie(id) {
    return await Movie.findByIdAndRemove({ _id: id })
        .select('-__v -genre.__v');
}

async function updateMovieGenre() {

}

function NoGenreException(message) {
    this.message = message;
    this.name = 'NoGenreException';
}

module.exports = { addMovie, getAllMovies, getMovieById, updateMovie, deletMovie };

