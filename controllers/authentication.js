const {staff} = require("../models/staffs")
const statusCodes =  require("http-status-codes")

const adminFirstSignUp = async(req,res)=> {
const totalNumberOfStaff  = await staff.find()
const {name,phoneNumber,password} = req.body

if(!name) {
    return res.statusCodes(statusCodes.BAD_REQUEST).json({msg:`name not found`})
}

if(phoneNumber) {
    return res.statusCodes(statudCodes.BAD_REQUEST).json({msg: `phone number not found`})
}

if(password) {
    return res.statusCodes(statusCodes.BAD_REQUEST).json({msg:`password is required`})
}
try {
    if(totalNumberOfStaff.length > 1) {
        return res.status(statusCodes.UNAUTHORIZED).json({msg:`unauthorized request`})
    }

    const admin =  await staff.create({name:name,phoneNumber:phoneNumber,role:"Director",password:password,level:3})
    const token = admin.createJWT()
    console.log(token)
    return res.status(statusCodes.CREATED).json({msg:`main admin has been created`,admin, token:token})
    

}catch(error) {
    return res.satus(statusCodes.INTERNAL_SERVER_ERROR).json({msg:error})
}
}

const registerAStaff = ()=> {

}

const staffLogin = ()=> {

}

const removeAStaff = ()=> {

}

const changeStaffLevel = ()=> {

}

module.exports = {adminFirstSignUp}