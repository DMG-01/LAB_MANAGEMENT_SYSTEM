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

const registerAStaff = async (req,res)=> {
    try{
    const {name, phoneNumber,role,password,level} = req.body 

    let staffPresent = await staff.findOne({phoneNumber})
    if(staffPresent) {
        return res.status(statusCodes.BAD_REQUEST).json({msg:`${staffPresent.name} already exist with phone number ${phoneNumber}`})
    }

    const _staff = await staff.create({name:name, phoneNumber:phoneNumber, role:role, password:password, level:level})
    return res.status(statusCodes.CREATED).json({msg:`new staff has been created`, _staff})


    }catch(error) {
       return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({msg:error})
    }
}

const returnAllStaff = async (req,res)=> {
    try {
        const allStaffs = await staff.find()
        if(!allStaffs) {
            return res.status(statusCodes.NOT_FOUND).json({msg:`no staff found`})
        }
        const totalNumberOfStaff = allStaffs.length 
        return res.status(statusCodes.OK).json({allStaffs, totalNumberOfStaff:totalNumberOfStaff})

    }catch(error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({msg:error})
    }
}

const staffLogin = async (req,res)=> {

    try {
       const { phoneNumber, password} = req.body 

       const _staff = await staff.findOne({phoneNumber})
       if(!_staff) {
        return res.status(statusCodes.NOT_FOUND).json({msg:`no staff with phone number ${phoneNumber} found`})
       }

       const isPassword =  _staff.comparePassword(password)
       if(!isPassword) {
        return res.status(statusCodes.UNAUTHORIZED).json({msg:`please enter correct login details`})
       }

       const jwtToken = _staff.createJWT()
       console.log(jwtToken)
       return res.status(statusCodes.OK).json({_staff})

    }catch(error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({msg:error})
    }
}

const removeAStaff = ()=> {

}

const changeStaffLevel = ()=> {

}

module.exports = {adminFirstSignUp, registerAStaff, returnAllStaff, staffLogin}