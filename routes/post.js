const router = require('express').Router();

const checkAuth = require('../middlewares/checkAuth');
const {posts, privatePost} = require('../db')

router.get('/public',(req,res)=>{
    res.send(posts)
})


router.get('/private',checkAuth,(req,res)=>{
    res.send(privatePost)
})

module.exports = router