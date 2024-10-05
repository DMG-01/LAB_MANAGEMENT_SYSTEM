const mongoose = require("mongoose")
const referralSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        unique:true
    },
    nurseHospital: {
        type:String,
        required:true,
        unique:true,
        enum:["hospital","nurse","private"]
    }
})

module.exports = mongoose.model("referral",referralSchema)