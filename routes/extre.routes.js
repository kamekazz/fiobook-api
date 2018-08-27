const router = require('express').Router()
const Cliente = require('../models/cliente')
const async = require('async')
const checkJwt = require('../middleware/check-jwt')
const Debet = require('../models/denuda')


// /api/extre

router.get('/', checkJwt, (req,res,next) =>{
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    let query = Debet.find({userId: req.decoded.user})
    query.populate('clienteId')
    query.find({ vivo: true })
    query.find({ name: regex })
    query.sort({ total: -1 })

    query.exec(function (err, data) {
        if (err) {
            res.json({
                success:false,
                message:err
            })
        } else if (data.length < 1) {
            res.json({
                success:false,
                message:'No Ahy Cliente Con ese Numbre  O Apodo',
            })
        } else{
            res.json({
                success:true,
                message:'Lista de Cliente:',
                data:data
            }) 
        }
    })
})

router.get('/todosnomebreyapodo', checkJwt, (req,res,next) =>{
    let query = Debet.find({userId: req.decoded.user})
    query.find({ vivo: true })
    query.sort({ total: -1 })
    query.select('name')
    query.exec(function (err, data) {
            res.json({
                success:true,
                message:'lista de Cliente',
                data:data
            }) 
        
    })
})







function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


       

module.exports = router