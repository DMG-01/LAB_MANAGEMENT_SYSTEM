const statusCodes = require("http-status-codes")
const service = require("../models/service")

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
    
}

module.exports =  {modifyAserviceProperties}