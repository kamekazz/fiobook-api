const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoose)

const DebetSchema = new Schema({
    name:String,
    nota:String,
    clienteId:{type:Schema.Types.ObjectId, ref:'Cliente'},
    userId:{type:Schema.Types.ObjectId, ref:'User'},
    created: {type:Date, default: Date.now},
    pagos:[{
        nota:String,
        cantida:{type:Number, default:0},
        created:{type:Date, default: Date.now}
    }],
    dabets:[{
        nota:String,
        cantida:Number,
        created: {type:Date, default: Date.now}
    }],
    capmax:Number,
    total:Number,
    vivo: {type:Boolean, default:true},
 
})
DebetSchema.plugin(deepPopulate)
module.exports = mongoose.model('Debet',DebetSchema)