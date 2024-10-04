    const mongoose = require("mongoose")


    const patientSchema = new  mongoose.Schema({
    patientFirstName: {
        type:String,
        required:[true, "Please enter patient name"],
        minlength:3
    },
    patientLastName: {
        type:String,
        required:[true,"please enter patient name"],
        minlength:3
    },
    patientPhoneNumber: {
        type:Number,
        required:[true,"please enter patient phone number"],
        unique:true
    },
    patientEmail: {
        type:String,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "please enter a valid email"],
        unique:true
    },
//referred from would be added 
//patient test would also be added


    })

    module.exports = mongoose.model("patient",patientSchema)