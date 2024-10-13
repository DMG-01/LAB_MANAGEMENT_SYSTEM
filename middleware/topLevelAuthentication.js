const {staff} = require("../models/staffs")
const statusCodes = require("http-status-codes")

const levelAuthentication = async (req,res,next)=> {
try {
const userId = req.params.id
const _staff = await staff.findOne({_id:userId})
const userLevel = _staff.level
if(userLevel < 3) {
    return res.status(statusCodes.UNAUTHORIZED).json({msg:`unauthorized`})
}
next()
}catch(error) {
    return 
}


}

module.exports = levelAuthentication