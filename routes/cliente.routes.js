const router = require('express').Router()
const Cliente = require('../models/cliente')
const async = require('async')
const checkJwt = require('../middleware/check-jwt')
// /api/cliente



router.get('/',checkJwt, (req,res,next) =>{
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
  async.waterfall([
      function (callback) {
            Cliente.find({name:regex},(err,clientesQuerryName)=>{
                if (clientesQuerryName) {
                    callback(err,clientesQuerryName)
                }
            })
    },    
      function (clientesQuerryName) {
        Cliente.find({apodo:regex},(err,clientesQuerryApodo)=>{
            if (clientesQuerryApodo) {
                res.json({
                    success: true,
                    message:'Good',
                    clientesQuerryApodo:clientesQuerryApodo,
                    clientesQuerryName:clientesQuerryName
                })
            }
        })
      }
  ])
})

router.get('/porcedula/:id', checkJwt, (req,res,next) =>{
    Cliente.findOne({cedula:req.params.id},(err,data)=>{
    
        if (err) {
            res.json({
                success:false,
                message:err
            })
        } else if (data.length < 1) {

            res.json({
                success:false,
                message: 'No Ahy Cliente Con ese Numero de Cedula'
            })

        } else{
            res.json({
                success:true,
                message:'Cliente en Contrado',
                data:data
            })
        }
    })
})



router.get('/todos', checkJwt, (req,res,next) =>{
    let clien =Cliente.find()
    clien.populate('reviews')
    clien.populate('deudaId')
    clien.deepPopulate('reviews.userId')
    
    clien.exec(function (err,data) { 
        if (err) return handleError(err);
        res.json({
            success:true,
            message:'todos los clientes',
            data:data,
        })
    })

})


router.get('/:id', checkJwt, (req,res,next) =>{
    let clien = Cliente.findOne({_id: req.params.id})
    clien.populate('reviews')
    clien.populate('deudaId')
    clien.deepPopulate('reviews.userId')
    
    clien.exec(function (err,data) {
        if (err) return handleError(err);
        res.json({
            success:true,
            message:'cliente en encontrado',
            data:data,
        }) 
    })

})







router.post('/old/name', checkJwt, (req,res,next) =>{


    let cliente = new Cliente
    cliente.name = req.body.name
    cliente.apodo = req.body.apodo
    cliente.cedula = req.body.cedula
    cliente.userId = req.decoded.user


    Cliente.findOne({name: req.body.name},(err, nameFindTru)=>{


        if (nameFindTru) {
            res.json({
                success:false,
                message:'client ya exsieste'
            })          
        } else {
            cliente.save()
            res.json({
                success: true,
                message: ' Nuevo cliente liste',
                cliente:cliente
            })
            
        }
    })

})



router.post('/new/cedula', checkJwt, (req,res,next) =>{

    let cliente = new Cliente
    cliente.name = req.body.name
    cliente.apodo = req.body.apodo
    cliente.cedula = req.body.cedula
    cliente.userId = req.decoded.user


    Cliente.findOne({cedula: req.body.cedula},(err, nameFindTru)=>{


        if  (nameFindTru) {
            res.json({
                success:false,
                message:'client ya exsieste'
            })          
        } else {
            cliente.save()
            res.json({
                success: true,
                message: ' Nuevo cliente liste',
            })
            
        }
    })

})

router.route('/address/:id')
.get(checkJwt, (req,res, next) =>{
    Cliente.findOne({_id: req.params.id}, (err, cliente)=>{
        res.json({
            success:true,
            address: cliente.address,
            message:'Successful'
        })
    })
})

.put(checkJwt, (req,res, next) =>{
    Cliente.findOne({_id: req.params.id}, (err, cliente)=>{
        if (err) return next(err);

        if(req.body.addr1) cliente.address.addr1 = req.body.addr1;
        if(req.body.addr2) cliente.address.addr2 = req.body.addr2;
        if(req.body.city) cliente.address.city = req.body.city;
        if(req.body.state) cliente.address.state = req.body.state;
        if(req.body.tel1) cliente.address.tel1 = req.body.tel1;
        if(req.body.tel2) cliente.address.tel2 = req.body.tel2;
        if(req.body.postalCode) cliente.address.postalCode = req.body.postalCode;

        cliente.save()
        res.json({
            success:true,
            message: 'direction a sido update'
        })
        
    })
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router