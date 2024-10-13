const jwt = require("jsonwebtoken")
const statusCodes = require("http-status-codes")
require("dotenv").config()

const adminAuthenticate = async (req,res,next)=> {

    const token = req.headers.authorization

    try{
const payload = jwt.verify(token,process.env.jwtt)
req.user = {userId:payload.userId,name:payload.name}
next()
    }catch(error){
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({msg:error})
    }
}



module.exports = adminAuthenticate

