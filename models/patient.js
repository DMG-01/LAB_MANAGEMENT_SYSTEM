    const mongoose = require("mongoose")


    const patientSchema = new  mongoose.Schema({
    firstName: {
        type:String,
        required:[true, "Please enter patient name"],
        minlength:3
    },
    lastName: {
        type:String,
        required:[true,"please enter patient name"],
        minlength:3
    },
    phoneNumber: {
        type:Number,
        required:[true,"please enter patient phone number"],
        unique:true
    },
    email: {
        type:String,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "please enter a valid email"],
        default:null
    },
    service: [{
        serviceId:{
        type:mongoose.Types.ObjectId,
        ref:"service",
        required:true
        },
        serviceTime: {
            type:Date,
            default:Date.now
        },
        amountPaid: {
            type:Number,
            required:true
        }
    }],
    referredFrom: {
        type:String,
        ref:"referral",
        default:"private"       
    },
    

    },{timestamps:true})

    module.exports = mongoose.model("patient",patientSchema)