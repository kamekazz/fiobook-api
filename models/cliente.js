const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const deepPopulate = require('mongoose-deep-populate') (mongoose)

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
    cedula:Number,
    deudaId:[{type:Schema.Types.ObjectId, ref:'Debet'}],
    userId:{type:Schema.Types.ObjectId, ref:'User'},
    dtotal:Number,
    created: {type:Date, default: Date.now}
},{
    toObject:{virtuals: true},
    toJSON:{virtuals: true},
})
    ClienteSchema
    .virtual('averageRating')
    .get(function () {
        var rating = 0
        if (this.reviews.length == 0) {
            rating = 0
        } else {
            this.reviews.map((review)=>{
                rating += review.star
            })
            rating = rating / this.reviews.length
        }
        return rating
    })

ClienteSchema.plugin(deepPopulate)
module.exports = mongoose.model('Cliente',ClienteSchema)