const router = require('express').Router()
const Debet = require('../models/denuda')
const Cliente = require('../models/cliente')
const checkJwt = require('../middleware/check-jwt')
const async = require('async')
// '/api/debet'

router.get('/', checkJwt, (req,res,next) =>{
    let query = Debet.find({userId: req.decoded.user})
    query.populate('clienteId')

    query.find({ vivo: true })
    query.sort({ total: -1 })
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
            Cliente.findOne({_id: req.body.ciId},(err, cienteId)=>{
                if (cienteId) {
                    callback(err,cienteId)
                } 
            })
        },
        function (cienteId) {
            let debet = new Debet
            debet.name = req.body.name
            debet.nota = req.body.nota
            debet.clienteId = req.body.ciId
            debet.userId = req.decoded.user
            debet.capmax = req.body.capmax
            debet.total = req.body.total

            cienteId.deudaId.push(debet._id)
            cienteId.save()
            debet.save()
                res.json({
                    success: true,
                    message:'dete del cliente lesto',
                    id:debet._id
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

    })

})

router.post('/:id', checkJwt, (req,res,next) =>{
    Debet.findOne({_id: req.params.id},(err, data)=>{
        if (err) return next(err);

        if (req.body.pagos) {
            data.pagos.unshift({cantida: req.body.pagos ,nota:req.body.nota })
            data.save()
            res.json({
                success:true,
                message: 'pago listo'
            })
        } else if (req.body.dabets) {
            data.dabets.unshift({cantida:req.body.dabets, nota:req.body.nota })
            data.save()
            res.json({
                success:true,
                message: 'fiado a puntado'

            })
        }   else{
            res.json({
                success:false,
                message: 'no se proseso la ransacsion'
            })
        }
    })
})


router.post('/edit/:id', checkJwt, (req,res,next) =>{
    Debet.findOne({_id: req.params.id},(err, data)=>{
        if (err) return next(err);
        if (data) {
            if(req.body.name) data.name = req.body.name;
            if(req.body.nota) data.nota = req.body.nota;
            if(req.body.vivo) data.vivo = req.body.vivo;
            data.save()
            res.json({
                success:true,
                message: 'deuda a sido edit'
            })   
        } else {
            res.json({
                success:false,
                message: 'false a  edit'
            })  
        }
    })
})

module.exports = router