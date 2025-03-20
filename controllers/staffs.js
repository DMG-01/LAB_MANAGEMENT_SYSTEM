const statusCodes = require("http-status-codes")
const service = require("../models/service")
const patient = require("../models/patient")
const register = require("../models/register")

const modifyAserviceProperties = async (req,res)=> {

    try {
        let newProperties = [...req.body]

        const _service = await service.findOne({_id:req.params.id})
        

        newProperties.forEach((prop)=> {
            if(!_service.properties.includes(prop)) {
                _service.properties.push(prop)
            }else {
                console.log(`${prop} already exists`)
            }
        })
  
        await _service.save()
        return res.status(statusCodes.OK).json({service:_service})

    }catch(error) {
        console.log(`error modidifying service properties : ${error}`)
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({error})
        
    }
}

const removeServiceProperties = async (req,res)=> {
    const propertiesToRemove = [...req.body]

    try {
        const _service = await service.findOne({_id:req.params.id})
        if(!_service) {
            return res.status(statusCodes.NOT_FOUND).json({msg:`service with service id ${req.params.id} not found`})
        }

        propertiesToRemove.forEach((prop)=> {
            if(_service.properties.includes(prop)) {
                _service.properties.pull(prop)
            }else {
                console.log(`${prop} does not exist`)
            }
        })
        await _service.save()
        return res.status(statusCodes.OK).json({_service})
    }catch(error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
}/*
const uploadAPatientResult = async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(statusCodes.BAD_REQUEST).json({ msg: "Please provide startDate and endDate" });
    }

    
    const start = new Date(startDate);
    const end = new Date(endDate);

    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(statusCodes.BAD_REQUEST).json({ msg: "Invalid date format. Use YYYY-MM-DD" });
    }

    try {
        
        const _patient = await patient.findOne(
            { _id: req.params.id },
            {
                service: {
                    $filter: {
                        input: "$service",
                        as: "service",
                        cond: {
                            $and: [
                                { $gte: ["$$service.serviceTime", start] },
                                { $lte: ["$$service.serviceTime", end] }
                            ]
                        }
                    }
                }
            }
        ).populate("service.serviceId");

        if (!_patient) {
            const __patientDetails = await  patient.findOne({_id:req.params.id})
            return res.status(statusCodes.NOT_FOUND).json({ msg: `No patient with id ${req.params.id} has a servcie at that time patient : ${__patientDetails}` });
       
     } 
    
        return res.status(statusCodes.OK).json({ _patient });
        
    } catch (error) {
        console.error("Error fetching patient services:", error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to fetch patient results" });
    }
};
*/

const uploadAPatientResult = async (req, res) => {
    try {
      const result = [...req.body];
  
      // Find the patient's registration and populate serviceId in Service array
      const patientInRegister = await register
        .findOneAndUpdate({ _id: req.params.id,
            "service.serviceId" : req.params.serviceId
         },{
            $push : {
                "service.$.values" : result
            }
        })
        .populate("service.serviceId");
       

      return(res.status(statusCodes.OK).json({msg : patientInRegister}))
    } catch (error) {
      console.error(`Failed to upload result: ${error.message}`);
      return res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: `Failed to upload result: ${error.message}` });
    }

  };
  
  module.exports = { modifyAserviceProperties, removeServiceProperties, uploadAPatientResult };
  
  
  module.exports = { modifyAserviceProperties, removeServiceProperties, uploadAPatientResult };
  
  
  
module.exports =  {modifyAserviceProperties,removeServiceProperties, uploadAPatientResult}