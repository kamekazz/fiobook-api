const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
    name:{type:String,unique:true,lowercase:true},
    apodo:String,
    reviews:[{type:Schema.Types.ObjectId, ref:'Review'}],
    address:{
        addr1:String,
        addr2:String,
        city:String,
        state:String,
        postalCode:String
    },
    tel:{
        tel1:Number,
        tel2:Number
    },
    cedula:{type:Number,unique:true},
    denudaId:[{type:Schema.Types.ObjectId, ref:'Denuda'}],
    userId:{type:Schema.Types.ObjectId, ref:'User'},
    dtotal:Number,

})

module.exports = mongoose.model('Cliente',ClienteSchema)