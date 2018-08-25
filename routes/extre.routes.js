const router = require('express').Router()
const Cliente = require('../models/cliente')
const async = require('async')
const checkJwt = require('../middleware/check-jwt')
const Debet = require('../models/denuda')

// /api/extre


router.get("/", checkJwt,  (req, res, next) => {
    Cliente.find({apodo: 'pana'}, {_id: 1}, function(err, docs) {

        // Map the docs into an array of just the _ids
        var ids = docs.map(function(doc) { return doc._id; });
    
        // Get the companies whose founders are in that set.
        Company.find({founder: {$in: ids}}, function(err, docs) {
            // docs contains your answer
        });
    });
})



       

module.exports = router