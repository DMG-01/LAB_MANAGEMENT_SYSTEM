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
}

const uploadAPatientResult = async (req, res) => {
    try {
      const result = [...req.body];
  
      // Find the patient's registration and populate serviceId in Service array
      const patientInRegister = await register
        .findOneAndUpdate({ _id: req.params.id,
            "service.serviceId" : req.params.serviceId
         },{
            $set : {
                "service.$.values" : result
            }
        })
        .populate("service.serviceId");
       
        if (!patientInRegister) {
            return res.status(statusCodes.NOT_FOUND).json({msg:`no patient with id ${req.params.id} found`})
        }

        console.log(`patient result has been uploaded successfully ${patientInRegister} adding result to patient history database`)

        

            

     
    } catch (error) {
      console.error(`Failed to upload result: ${error.message}`);
      return res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: `Failed to upload result: ${error.message}` });
    }

  };
  
  module.exports = { modifyAserviceProperties, removeServiceProperties, uploadAPatientResult };
  