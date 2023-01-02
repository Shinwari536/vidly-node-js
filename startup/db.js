const config = require('config');
const mongoose = require('mongoose');
const winston = require('winston');
const dbDebugger = require('debug')('app:db');


module.exports = function () {
    // db connection
    mongoose.set('strictQuery', true);
    if (config.has('dbHost')) {
        module.exports = mongoose.connect(config.get('dbHost'))
            .then(() => winston.info('Connected to db...'));
            // .catch(err => dbDebugger('Error: ', err));
    }

}