const { required } = require("joi")
const mongoose = require("mongoose")

const registerSchema = mongoose.Schema({
    labNumber: {
        type:Number,
        required:[true,"lab number is required"]
    },
    FirstName: {
        type:String,
        required:[true,"firstName is required"]
    },
    LastName : {
        type:String,
        required:[true,"lastName is required"]
    },
    phoneNumber: {
        type:Number,
        required:[true,"phoneNumber is required"]
    },
    email : {
        type:String
    },
    service: [
        {
            serviceId: { 
                type: mongoose.Types.ObjectId,
                 ref: "service" 
                },
          values: 
          { type: [String],
             default: [] 
            },
            serviceTime : {
                type:Date,
                default:Date.now,
                required    : [true, "service time is required" ]
            }
        },
      ],
    amountPaid: {
        type:Number,
        required:[true,"amount paid is required"]
    },
    methodOfPayment: {
        type:String,
        required:[true,"method of payment is required"]
    },
    referral : {
        type:mongoose.Types.ObjectId,
        ref:'HospitalDiscount'
    }, 
    Time : {
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("register", registerSchema)