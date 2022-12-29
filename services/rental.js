const db = require('debug')('app:db');
const { Rental } = require('../models/rentalModel')
const { Customer, Movie } = require('../models/models')


async function newRental(customerId, movieId) {
    const customer = await Customer.findById(customerId);
    if (!customer) {
        throw new NoCustomerException('No customer found with the given id.')
    }
    const movie = await Movie.findById(movieId);
    if (!movie) {
        throw new NoMovieException('No movie found with the given id.')
    }
    if (movie.numberInStock === 0) {
        throw new MovieStockException('Movie of given id is not in the stock.')
    }

    let rental = new Rental({
        customer: {
            _id: customer.id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie.id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        },
        rentalFee: 400
    });

    let session = await Rental.startSession();
    session.startTransaction();
    try {
        const opts = { session };
        rental = rental.save(opts);

        // decrement stock
        movie.numberInStock--;
        movie.save(opts);

        await session.commitTransaction();
        session.endSession();

        // return rental
        return rental;

    } catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        await session.abortTransaction();
        session.endSession();
        db(error);
        throw error;
    }
}

 
async function getAllRentals() {
    return Rental.find()
        .select('-__v -customer.__v -movie.__v');
}

async function getRentalById(id) {
    return Rental.findById(id)
        .select('-__v -customer.__v -movie.__v');
}


function NoCustomerException(message) {
    this.message = message;
    this.name = 'NoCustomerFoundException';
}

function NoMovieException(message) {
    this.message = message;
    this.name = 'NoMovieFoundException';
}

function MovieStockException(message) {
    this.message = message;
    this.name = 'MovieNotInStockException';
}
module.exports = { newRental, getAllRentals, getRentalById }