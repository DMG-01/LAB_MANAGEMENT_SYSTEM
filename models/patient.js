    const mongoose = require("mongoose")

    const patientSchema = new mongoose.Schema({
        firstName: {
            type: String,
            required: [true, "Please enter patient name"],
            minlength: 3
        },
        lastName: {
            type: String,
            required: [true, "Please enter patient name"],
            minlength: 3
        },
        phoneNumber: {
            type: Number,
            required: [true, "Please enter patient phone number"],
            unique: true
        },
        email: {
            type: String,
            match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "please enter a valid email"],
            default: null
        },
        age : {
            type:Number
        },
        service: [{
            serviceId: {
                type: mongoose.Types.ObjectId,
                ref: "service",
                required: true
            },
            serviceTime: {
                type: Date,
                default: Date.now
            },
            amountPaid: {
                type: Number,
                required: true
            },
            methodOfPayment: {
                type: String,
                required: true
            },
            referredFrom: {
                type: String,
                default: "private" // "private" is the default value
            }
        }]
    }, { timestamps: true });

    
    module.exports = mongoose.model("patient",patientSchema)