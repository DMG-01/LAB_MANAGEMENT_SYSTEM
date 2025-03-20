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
        .findOne({ _id: req.params.id })
        .populate("Service.serviceId");
        return res.status(statusCodes.OK).json({patientInRegister})
/*
 
       // console.log("Patient found in register", patientInRegister);
        //console.log(patientInRegister._id)
        console.log(`patient services : ${patientInRegister.Service[0]}`)
        patientInRegister.Service.forEach((service, index) => {
            console.log(`Service ${index + 1} ID: ${service.serviceId}`);
          });
          
          
  
      if (!patientInRegister) {
        console.log("No patient found in register");
        return res
          .status(statusCodes.NOT_FOUND)
          .json({ msg: `No patient with register id ${req.params.id} found` });
      }
  
      //console.log("Patient found in register", patientInRegister);
  
      // Find the specific service entry associated with this patient
      const serviceEntry = patientInRegister.Service.find(
        {serviceId: req.params.serviceId}
      );
      console.log("Service entry found", serviceEntry);
  
      if (!serviceEntry) {
        console.error(`Service with ID ${req.params.serviceId} not found for this patient.`);
        return res
          .status(statusCodes.BAD_REQUEST)
          .json({ msg: `Service not linked to this patient.` });
      }
  
      console.log(`Service found: ${serviceEntry.serviceId._id}`);
  
      // Ensure result length matches the service's properties length
      if (result.length !== serviceEntry.serviceId.properties.length) {
        console.log("Invalid result upload");
        return res
          .status(statusCodes.BAD_REQUEST)
          .json({ msg: `The result data doesn't match the service structure.` });
      }
  
      console.log("Result matches service properties");
  
      // Update the correct service's values array
      const updatedRegister = await register.findOneAndUpdate(
        {
          _id: req.params.id,
          "Service.serviceId": req.params.serviceId,
        },
        {
          $push: { "Service.$.values": { $each: result } },
        },
        { new: true }
      ).populate("Service.serviceId");
  
      console.log("Updated register successfully", updatedRegister);
  
      return res
        .status(statusCodes.OK)
        .json({ msg: "Updated successfully", updatedRegister });
        */
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