const patient = require("../models/patient");
const hospitalDiscount = require("../models/hospitalDiscount")
const statusCodes = require("http-status-codes");

const calculateDiscount = async (req, res) => {

    try {
         const {hospitalName } = req.query

         hospital = await hospitalDiscount.findOne({Name:hospitalName})
         if(!hospital) {
            res.status(statusCodes.NOT_FOUND).json({msg:`No hospital with name ${hospitalName} found`})
         }

         const totalDiscount = hospital.totalDiscount

        res.status(statusCodes.OK).json({hospital,msg:` total discount is ${totalDiscount}`})
    }catch(error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({msg:error})
    }
    
};

const returnAllHospitalAndDiscount = async (req, res) => {
    try {
        const hospitalsAndDiscount = await hospitalDiscount.find();
        if (!hospitalsAndDiscount || hospitalsAndDiscount.length === 0) {
            return res.status(statusCodes.NOT_FOUND).json({ msg: `No hospital and discount found` });
        }
        return res.status(statusCodes.OK).json({ hospitalsAndDiscount });
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
};

module.exports = { calculateDiscount, returnAllHospitalAndDiscount };
