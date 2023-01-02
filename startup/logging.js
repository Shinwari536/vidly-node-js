require('express-async-errors');
const winston = require('winston')

module.exports = function () {
    

    //
    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    //
    // if (process.env.NODE_ENV !== 'production') {
    //     logger.add(new winston.transports.Console({
    //         format: winston.format.simple(),
    //     }));
    // }

    // Catching uncaugt errors on Node Level
    process.on('uncaughtException', (err) => {
        console.log('We got an UNCAUGHTEXCEPTION!');
        winston.error(err.message, err);
        process.exit(1);
    });

    // Catching errors on Node Level
    process.on('unhandledRejection', (err) => {
        throw err;
    });

    return winston.createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.colorize({
                    all: true
                })
            }),
            new winston.transports.File({ filename: 'combined.log' })
        ]
    });
}