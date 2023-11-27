const jwt = require('jsonwebtoken')
const User = require('../models/User_')
require('dotenv').config();

const checkLogin = async(req,res,next)=>{
    let {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({error:"You need to logged in!"});
    }
    let token = authorization.replace('Bearer ','');
    jwt.verify(token,process.env.SECRET,(error,payload)=>{
        if(error){
            return res.status(401).json({error:"You must be logged in!"})
        }
        id = payload._id;
    })
    let user = await User.findOne({_id:id});
    req.user = user;
    next();
}
module.exports = checkLogin;