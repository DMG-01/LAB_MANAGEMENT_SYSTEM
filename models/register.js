const mongoose = require("mongoose")

const registerSchema = mongoose.Schema({
    labNumber: {
        type:Number,
        required:[true,"lab number is required"]
    },
    patientId: {
        type:mongoose.Types.ObjectId,
        ref:"patient"
    },
    Service: [{
        type:mongoose.Types.ObjectId,
        required:[true,"service is required"],
        ref:"service",
        default:[]
    }],
    amountPaid: {
        type:Number,
        required:[true,"amount paid is required"]
    },
    methodOfPayment: {
        type:String,
        required:[true,"method of payment is required"]
    }
})

module.exports = mongoose.model("register", registerSchema)