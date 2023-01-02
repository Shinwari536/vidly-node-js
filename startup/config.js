const config = require('config');

module.exports = function () {
    // check for private key in environment variable
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
    }

}