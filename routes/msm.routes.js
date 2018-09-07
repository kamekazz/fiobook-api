const router = require('express').Router()
const accountSid = 'AC59ba6489a4d1b3ccd7944632bef0dbf5';
const authToken = '6f6f5541f1b704a18b65d83a6034399d';
const client = require('twilio')(accountSid, authToken);
var request = require('request');

router.post('/', (req,res,next) =>{
    console.log(req.body);
    res.json({ok:'ok'})
})

router.post('/send', (req,res,next) =>{
    client.messages
      .create({
        body: 'dime silo resiviste!',
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+18295109542'
      })
      .then(message => console.log(message.sid))
      .done();
      res.send({
          ok:'ok'
      })
})



module.exports = router