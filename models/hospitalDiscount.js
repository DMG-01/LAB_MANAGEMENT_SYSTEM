const mongoose =  require("mongoose")
const hospitalDiscount = mongoose.Schema({
    Name: {
        type:String,
        required:true,
        unique:true
    },
    totalAmount: {
        type:Number,
        required:true,
        default:0
    },
    accountNumber: {
        type:String
    },
    totalDiscount: {
        type:Number,
        required:true,
        default:0
    },
    totalDiscountPayed: {
        type:Number,
        required:true,
        default:0
    }
},{timestamp:true})

module.exports = mongoose.model("hospitalDiscount", hospitalDiscount)