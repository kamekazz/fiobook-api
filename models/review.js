const mongoose = require('mongoose')
const deepPopulate = require('mongoose-deep-populate') (mongoose)
const Schema = mongoose.Schema;


const ReviewSchema = new Schema({
    star:{type:Number,default:0},
    nota:String,
    userId:{type:Schema.Types.ObjectId, ref:'User'},
    created: {type:Date, default: Date.now}
})

ReviewSchema.plugin(deepPopulate)
module.exports = mongoose.model('Review',ReviewSchema)