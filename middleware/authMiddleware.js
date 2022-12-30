const jwt = require('jsonwebtoken');
const config = require('config');
const debug = require('debug')('app:authorization')

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send({data: null, error: "ACCESS DENIED: No token found.", success: false});

    try {
        const decode = jwt.decode(token, config.get('jwtPrivateKey'))
        if (!decode){
            debug("decode-1: ", decode)
            return res.status(400).send({data: null, error: "Invalide token.", success: false});
        }
        req.user = decode;
        debug("decode-2-7: ", decode)
        next();
    } catch (error) {
        debug(error);
        res.status(400).send({data: null, error: "Invalide token.", success: false});
    }
}