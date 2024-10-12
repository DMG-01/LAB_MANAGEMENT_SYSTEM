const staff = require("../models/staffs")
const statusCodes =  require("http-status-codes")

const adminFirstSignUp = async(req,res)=> {

try {
const numberOfStaff  = await staff.find()
const {name,phoneNumber,password} = req.body

if(!name) {
    return res.status(statusCodes.BAD_REQUEST).json({msg:`name not found`})
}

if(!phoneNumber) {
    return res.status(statusCodes.BAD_REQUEST).json({msg: `phone number not found`})
}

if(!password) {
    return res.status(statusCodes.BAD_REQUEST).json({msg:`password is required`})
}

    if(numberOfStaff.length > 0) {
        return res.status(statusCodes.UNAUTHORIZED).json({msg:`unauthorized request`})
    }

    const admin =  await staff.create({name:name,phoneNumber:phoneNumber,role:"Director",password:password,level:3})
    if(!admin) {
        return res.status(statusCodes.BAD_REQUEST).json({msg:`error creating admin`})
    }
    const token = admin.createJWT()
    console.log(token)
    return res.status(statusCodes.CREATED).json({msg:`main admin has been created`,admin, token:token})
    

}catch(error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({error})
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