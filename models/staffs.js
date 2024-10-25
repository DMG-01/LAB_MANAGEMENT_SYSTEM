const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const staffsSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        minlength:3
    },
    phoneNumber: {
        type:String,
        required:true,
        unique:true
    },
    role: {
        type:String,
        required:true,
        enum:["front_desk","scientist","xonographer","Director"]
    },
    password: {
        type:String,
        required:true,
    },
    level: {
        type:Number,
        required:true,
        default:1
    }
},{timestamp:true})

staffsSchema.pre("save", async function(next) {
const salt = await bcrypt.genSalt(10)
this.password = await bcrypt.hash(this.password,salt)
next()
})

staffsSchema.methods.createJWT = function() {
    const jwtToken = jwt.sign({userId:this._id,name:this.name},process.env.JWTT,{expiresIn:"30d"})
    console.log(jwtToken)
    return jwtToken
}

staffsSchema.methods.comparePassword = async function (passwordToCompare) {

    const isPassword = await bcrypt.compare(passwordToCompare,this.password)
    return isPassword
}

module.exports = mongoose.model("staff",staffsSchema)