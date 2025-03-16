const mongoose = require("mongoose")

const serviceSchema = new mongoose.Schema({

    name: {
        type:String,
        minLength:3,
        unique:true,
        required:true
    },

    price: {
        type:Number,
        required:true,
    },

    properties:{
       type : [String],
       default : []
    } ,
    values : {
        type :[String],
        default : []
    }
},{timestamps:true})

module.exports = mongoose.model("service",serviceSchema)