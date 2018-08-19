const router = require('express').Router()
const Debet = require('../models/denuda')
const Cliente = require('../models/cliente')
const Review = require('../models/review')
const async = require('async')

const checkJwt = require('../middleware/check-jwt')


router.post('/new',checkJwt,(req,res,next)=>{
    async.waterfall([
        function (callback) {
            Cliente.findOne({_id: req.body.cienteId},(err, cienteId)=>{
                if (cienteId) {
                    callback(err,cienteId)
                } else if (err) {
                    res.json({
                        success: false,
                        message:'valor del cliente lesto'
                    })
                }
            })
        },
        function (cienteId) {
            let review = new Review()
            review.userId = req.decoded.user._id

            if(req.body.star)review.star = req.body.star
            if (req.body.nota) review.nota = req.body.nota
            if (req.body.deudaId) review.deudaId = req.body.deudaId

            cienteId.reviews.push(review._id)
            cienteId.save()
            review.save()
                res.json({
                    success: true,
                    message:'valor del cliente lesto'
                })
        }
    ])
})







module.exports = router