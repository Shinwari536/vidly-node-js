const winston = require('winston');

module.exports = function (err, req, res, next) {
    // log errors/exceptions

    // Levels of error
    /*
        error: 0,
        warn: 1,
        info: 2,m
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    */
    winston.error(err.message, err);
    


    // TODO: 
    /*
        What we need to do here is:
        1- Identify all types of errors and status codes for them.
        2- Apply conditions on them, to get correct error in order to send correct status code.
    */
    res.status(500).send(err);
}