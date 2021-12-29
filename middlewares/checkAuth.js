require("dotenv").config();


const JWT = require('jsonwebtoken');

module.exports = async (req,res,next)=>{

    const token = req.header('x-auth-token');
    if(!token){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "No token found",
                }
            ]
        })
    }

    try {
        const user = await JWT.verify(token,process.env.ACCESS_TOKEN_KEY);
        req.user = user.email;
        next();
    } catch (error) {
        return res.status(400).json({
            "errors": [
                {
                    "msg": "Token invalid",
                }
            ]
        })
    }
    

    let userValid = true;
    if(userValid){
        next()
    }
    else{
        return res.status(400).json({
            "errors": [
                {
                    "msg": "Access denied",
                }
            ]
        })
    }
}