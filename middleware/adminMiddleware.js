// this function will be executed after the authorization middleware function
module.exports = function(req, res, next){

    if (!req.user.isAdmin) return res.status(403).send({ // 403 = Forbidden
        data: null, 
        error: "ACCESS DENIED: Not authorized to operate.", 
        success: false});
    next();
}