const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:index');
const config = require('config');
const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:db');
const genreRouter = require('./routes/genreRouter');
const customerRouter = require('./routes/customerRouter')
const movieRouter = require('./routes/movieRouter')

// create express app
const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

// db connection
mongoose.set('strictQuery', true);
if (config.has('dbHost')) {
    module.exports = mongoose.connect(config.get('dbHost'))
    .then(() => dbDebugger('Connected to db...'))
    .catch(err => dbDebugger('Error: ', err));
}

// setting routes
app.use('/api/genres', genreRouter);
app.use('/api/customers', customerRouter);
app.use('/api/movies', movieRouter);


// start app
const port = process.env.PORT || 3000
console.log(port);
app.listen(port, () => console.log(`Listening at port ${port}...`));
