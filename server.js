const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const confingP = require('./config')


const app =  express()

mongoose.connect(`mongodb://${confingP.mlabU}:${confingP.mlabP}@ds121382.mlab.com:21382/libro`,{ useNewUrlParser: true },(err)=>{
    if (err) {
        console.log(`Mcod:.......................v1.0 ${err}`);
    } else {
        console.log(`mlab DB is runing.......`);
    }
})

app.use(
    bodyParser.json(),
    bodyParser.urlencoded({extended:false}),
    morgan('dev'),
    cors()
)

const userRouters = require('./routes/user.routes')
const clienteRouters = require('./routes/cliente.routes')
const denudaRouters = require('./routes/denuda.routes')
const reviewRouters = require('./routes/review.routes')
const extraRouters = require('./routes/extre.routes')



app.use('/api/review',reviewRouters)
app.use('/api/extre',extraRouters)
app.use('/api/accounts',userRouters)
app.use('/api/cliente',clienteRouters)
app.use('/api/debet',denudaRouters)




app.listen(process.env.PORT || 3030 ,()=>{
    console.log('node.js server is runing........');
})