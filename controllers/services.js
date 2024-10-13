const service = require("../models/service")
const statusCodes = require("http-status-codes")

const createService = async (req,res)=> {
        try {
    const newService = await service.create(req.body)
    return res.status(statusCodes.CREATED).json({newService})
        }catch(error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({msg:error})
        }
}

const getOneService = async (req,res)=> {
    try{
        const _service = await service.findOne({_id:req.params.id})
        if(!_service) {
            return res.status(statusCodes.NOT_FOUND).json({msg:`no service with id ${req.params.id} found`})
        }
        return res.status(statusCodes.OK).json({_service})
    }catch(error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({msg:error})
    }

    
}

const changeServicePrice = async(req,res)=> {
    try{
        const {price: newPrice} = req.body
        const _service = await service.findOneAndUpdate({_id:req.params.id},{price:newPrice},{new:true,runValidators:true}) 
        if(!_service) {
            return res.status(statusCodes.NOT_FOUND).json({msg:`no service with id ${req.params.id} found`})
        }
        return res.status(statusCodes.OK).json({_service})
    }catch(error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({msg:error.message})
    }
}

const getAllServices = async (req,res)=> {
    try {
        const allServices = await service.find()
        return res.status(statusCodes.OK).json({allServices})
    }catch(error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
}

const deleteAService = async (req,res)=> {
    try {
     const serviceToDelete = await service.findOneAndDelete({_id:req.params.id})
     if(!serviceToDelete) {
         return res.status(statusCodes.NOT_FOUND).json({msg:`the service with id ${req.params.id} was not found`})
     }
     return res.status(statusCodes.OK).json({msg:`the service with id ${serviceToDelete} has been deleted`})
    }catch(error){
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({msg:error})
    }
}


module.exports = {createService,getOneService,changeServicePrice,getAllServices,deleteAService}
