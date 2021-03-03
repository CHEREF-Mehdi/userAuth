const Router=require('express').Router

const router = Router();

router.get('/login',(req,res,next)=>{
    res.json({
        status: 200,
        message:"ok"
    })
    next();
})

router.get('/regester',(req,res,next)=>{
    res.json({
        status: 200,
        message:"ok"
    })
    next();
})

module.exports = router;