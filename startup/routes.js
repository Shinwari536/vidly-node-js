const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const genreRouter = require('../routes/genreRouter');
const customerRouter = require('../routes/customerRouter');
const movieRouter = require('../routes/movieRouter');
const rentalRouter = require('../routes/rentalRouter');
const userRouter = require('../routes/userRouter');
const authRouter = require('../routes/authRouter');
const errorsMiddleware = require('../middleware/errorsMiddleware');


module.exports = function (app) {
    app.use(helmet());
    app.use(morgan('tiny'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // setting routes
    app.use('/api/genres', genreRouter);
    app.use('/api/customers', customerRouter);
    app.use('/api/movies', movieRouter);
    app.use('/api/rentals', rentalRouter);
    app.use('/api/users', userRouter);
    app.use('/api/auth', authRouter);
    // errors middleware
    app.use(errorsMiddleware);
}