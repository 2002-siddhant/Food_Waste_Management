let jwt = require('jsonwebtoken');
const User = require('../Models/users');
const authMiddleware = async(req,res,next)=>{
    const token = req.header('Authorization');
    if(!token){
        return res.status(401).json({message:"No token, authorization denied"});
    }
    try{
        const decoded = jwt.verify(token, '123456');
        req.user = decoded.user;
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({message:"Token is not valid"});
    }
}
module.exports  = authMiddleware;