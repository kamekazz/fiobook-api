const router = require('express').Router()
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const config = require('../config')
const checkJwt = require('../middleware/check-jwt')


router.post('/registarl', (req,res, next)=>{
    let user = new User()
    user.tienda = req.body.tienda
    user.email = req.body.email
    user.password = req.body.password
    user.picture = user.gravatar()

    User.findOne({email: req.body.email}, (err, existingUser)=>{
        if (existingUser) {
            res.json({
                success:false,
                message:'Account with that email is alredy Exist'
            })
        } else {
            user.save()
            var token = jwt.sign(
                {user: user},config.secret,
                {expiresIn:'7d'}
            );

            res.json({
                success: true,
                message: 'esta enlazado con tu token',
                token: token
            })
        }
    })
})


router.post('/login', (req,res, next)=>{
    User.findOne({email: req.body.email}, (err, user)=>{
        if (err) throw err

        if (!user) {
            res.json({
                success: false,
                message: 'usuario no exsiste'
            })
        } else if (user) {
            var validPassword = user.comparePassword(req.body.password)
            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'claveno exsiete'
                })
            } else{
                var token = jwt.sign(
                    {user: user},config.secret,
                    {expiresIn:'7d'}
                );

                res.json({
                    success:true,
                    message: 'listo!! comiensa fiar',
                    token: token
                })
            }
        }
    })

})

router.route('/profile')
    .get(checkJwt, (req,res, next) =>{
        User.findOne({_id: req.decoded.user._id}, (err, user)=>{
            res.json({
                success:true,
                user: user,
                message:'Successful'
            })
        })
    })
    .post(checkJwt, (req,res, next) =>{
        User.findOne({_id: req.decoded.user._id}, (err, user)=>{
            if (err) return next(err);

            if(req.body.tienda) user.tienda = req.body.tienda;
            if(req.body.email) user.email = req.body.email;
            if(req.body.password) user.password = req.body.password;

            user.save()

            res.json({
                success:true,
                message: 'prefir cambiado'
            })

        })
    })

     
module.exports = router