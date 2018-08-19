const router = require('express').Router()
const Debet = require('../models/denuda')
const Cliente = require('../models/cliente')
const checkJwt = require('../middleware/check-jwt')
const async = require('async')


router.get('/', checkJwt, (req,res,next) =>{
    Debet.find({userId: req.decoded.user},(err, todoslasdeuda)=>{
        if (todoslasdeuda) {
          
            res.json({
                success: true,
                message: 'Todas las lista de deuda',
                data: todoslasdeuda
            })
        } else {
            res.json({
                success: true,
                message: 'notienes deuda',
            })
        }

    })
})

router.get('/pendiente', checkJwt, (req,res,next) =>{
    let query = Debet.find({userId: req.decoded.user})

    query.select('clienteId name total capmax vivo created')
    query.sort({ total: -1 })

    query.populate('clienteId','name')


    query.find({ vivo: true })


    query.exec(function (err, data) {
    if (err) return handleError(err);
        res.json({
            success:true,
            message:'listo',
            data:data,
        }) 
    })


})


router.post('/new', checkJwt, (req,res,next) =>{
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
            let debet = new Debet
            debet.name = req.body.name
            debet.nota = req.body.nota
            debet.clienteId = req.body.clienteId
            debet.userId = req.decoded.user
            debet.capmax = req.body.capmax
            debet.total = req.body.total

            cienteId.deudaId.push(debet._id)
            cienteId.save()
            debet.save()
                res.json({
                    success: true,
                    message:'dete del cliente lesto'
                })
        }
    ])
})

router.get('/:id', checkJwt, (req,res,next) =>{
    Debet.findOne({_id: req.params.id},(err, data)=>{
        if (data) {
            let pagos1 = data.pagos
            let totalpago = 0
            
            for (let index = 0; index < pagos1.length; index++) {
                totalpago += pagos1[index].cantida
            }
            let dabets1 = data.dabets
            let totalDeuda = 0
                for (let index = 0; index < dabets1.length; index++) {
                    totalDeuda += dabets1[index].cantida
                }
            totalpago
            totalDeuda
            
            data.total = totalDeuda - totalpago

            res.json({
                success:true,
                message: 'tu libro',
                data: data,
                dabetTotal: totalDeuda,
                pagoTotal: totalpago,
            })
        } else {
            res.json({
                success:false,
                message: 'error'
            })
        }

    })

})

router.put('/:id', checkJwt, (req,res,next) =>{
    Debet.findOne({_id: req.params.id},(err, data)=>{
        if (err) return next(err);
        if (req.body.nota) {
            data.nota = req.body.nota
        }
        if (req.body.pagos) {
            data.pagos.push({cantida: req.body.pagos ,nota:req.body.nota })
        }
        if (req.body.dabets) {
            data.dabets.push({cantida:req.body.dabets, nota:req.body.nota })
        }
        if (err) {
            res.json({
                success:false,
                message:err
            })
        } else {
            if (data) {
                let pagos1 = data.pagos
                let totalpago = 0
                
                for (let index = 0; index < pagos1.length; index++) {
                    totalpago += pagos1[index].cantida
                }
                let dabets1 = data.dabets
                let totalDeuda = 0
                    for (let index = 0; index < dabets1.length; index++) {
                        totalDeuda += dabets1[index].cantida
                    }
                totalpago
                totalDeuda
                
                data.total = totalDeuda - totalpago
                data.save()
                res.json({
                    success:true,
                    message: 'tu libro',
                    data: data,
                    dabetTotal: totalDeuda,
                    pagoTotal: totalpago,
                })
            } else {
                res.json({
                    success:false,
                    message: 'error'
                })
            }
        }

    })

})


module.exports = router