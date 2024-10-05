const patient = require("../models/patient")
const  statusCodes = require("http-status-codes")

const registerPatient = async (req,res)=> {
//res.send("register")
const {firstName,lastName,phoneNumber,email,serviceId,referredFrom} = req.body    
const patientDetails = await patient.findOne({phoneNumber})

if(!patientDetails) {
    try{
    
    const newPatient = await patient.create( {firstName,lastName,phoneNumber,email,serviceId,referredFrom})
    return res.status(statusCodes.CREATED).json({newPatient})
    }catch(error){
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({msg:error})
    }
}else {
    try{
     patientDetails.service.push({serviceId})
     await patientDetails.save()
     res.status(statusCodes.OK).json({patientDetails})
    }catch(error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({msg:error})
    }
}

}

const returnPatient = async (req,res)=> {
    res.send("patient")
}


module.exports = {registerPatient,returnPatient}