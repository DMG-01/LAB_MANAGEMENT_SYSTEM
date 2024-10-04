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
    }
},{timestamp:true})

module.exports = mongoose.model("service",serviceSchema)