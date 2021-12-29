require("dotenv").config();
const router = require('express').Router();
const {check, validationResult } = require("express-validator")
const bcrytp = require("bcrypt")
const JWT = require("jsonwebtoken")

const {users} = require('../db');


router.get('/',(req,res)=>{
    res.send("Auth route working")
})

router.post('/signup',[
    check("email","Please provide a valid email").isEmail(),
    check("password","Please provide a password that is greater than 5 characters").isLength({
        min:6
    })
],async (req,res)=>{
    const {password,email} = req.body;

    //validate input
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }


    //validate if user doesn't already exists in the database
    let user = users.find((user)=>{
      return  user.email === email
    })

    if(user){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "User already exists",
                }
            ]
        })
    }

    const hashedPassword = await bcrytp.hash(password,10);

    users.push({
        email,password:hashedPassword
    })
    
    const token = await JWT.sign({
        email,
    },process.env.ACCESS_TOKEN_KEY,{
        expiresIn:"10m"
    })

    res.json({token})
})


/******************************************************* */
router.get('/all',(req,res)=>{
    res.json(users)
})

/******************************************************* */
router.post('/login',async (req,res)=>{
    const {password,email}= req.body;

    const user = users.find(user=>{
        return user.email === email;
    });

    if(!user){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "Invalid credentials",
                }
            ]
        })
    }

    const isMatch = await bcrytp.compare(password,user.password)

    if(!isMatch){
        return res.status(400).json({
            "errors": [
                {
                    "msg": "Invalid credentials",
                }
            ]
        })
    }

    const token = await JWT.sign({
        email,
    },process.env.ACCESS_TOKEN_KEY,{
        expiresIn:"10m"
    })

    res.json({token})

})



module.exports = router