const statusCodes = require("http-status-codes")
const service = require("../models/service")
const patient = require("../models/patient")

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

const uploadAPatientResult = async(req,res)=> {

    const _patient = await patient.findOne({_id:req.params.id})
    
    if(!_patient) {
        return res.status(statusCodes.NOT_FOUND).json({msg:`patient with _id ${req.params.id} not found`})
    }


    try {

    }catch(error) {
        return res.stat
    }
}


const modifyPatientResult = async(req,res)=> {

}

module.exports =  {modifyAserviceProperties,removeServiceProperties}