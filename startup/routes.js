const genreRouter = require('../routes/genreRouter');
const customerRouter = require('../routes/customerRouter');
const movieRouter = require('../routes/movieRouter');
const rentalRouter = require('../routes/rentalRouter');
const userRouter = require('../routes/userRouter');
const authRouter = require('../routes/authRouter');
const uploadRouter = require('../routes/fileUploadRouter');
const errorsMiddleware = require('../middleware/errorsMiddleware');


module.exports = function (app) {
        // setting routes
    app.use('/api/genres', genreRouter);
    app.use('/api/customers', customerRouter);
    app.use('/api/movies', movieRouter);
    app.use('/api/rentals', rentalRouter);
    app.use('/api/users', userRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/files', uploadRouter);
    // errors middleware
    app.use(errorsMiddleware);
}