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

const payADiscount = async (req,res)=> {

    try {
          const {hospitalDiscountToPay} = req.query
          const {discountToPay} = req.body

          const hospital = await hospitalDiscount.findOne({ Name: hospitalDiscountToPay})
          if(!hospital) {
            return res.status(statusCodes.NOT_FOUND).json({msg:`no hospital with name ${req.query} found`})
          }
          //const hospitalDiscount = await hospital.totalDiscount
          //const hospitalAccountNumber = await hospital.hospitalAccountNumber


          hospital.totalDiscountPayed += discountToPay
          await hospital.save()

          const remainingDiscountToPay = hospital.totalDiscount - hospital.totalDiscountPayed

          return res.status(statusCodes.OK).json({msg:`${discountToPay} has been paid, remaining discount to pay is ${remainingDiscountToPay}`, hospital})
    }catch(error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({msg:error})
    }
}

const changeAccountNumber = async (req,res)=> {

}

module.exports = { calculateDiscount, returnAllHospitalAndDiscount, payADiscount };
