const patient = require("../models/patient")
const statusCodes = require("http-status-codes")
const calculateDiscount = async (req,res)=> {
    const {referredFrom} = req.query

    const patientsRefferedFrom = await patient.find({"service.referredFrom":referredFrom})
    if(!patientsRefferedFrom) {
         return res.status(statusCodes.NOT_FOUND).json({msg:`No Patient referred from ${referredFrom}`})
    }

    let totalAmount = 0

    for(let index = 0;index <= patientsRefferedFrom.length;index++) {
        totalAmount = patientsRefferedFrom[index].service.amountPaid
    }
    const discount = ((10/100)*totalAmount)
    res.status(statusCodes.OK).json({msg:`the total discount of ${referredFrom} is ${discount}`})
    //get hospital
    // use hospital to find the total amount of referrals
    // calculate the ten percent 
    // show that it has been paid
}


module.exports = {calculateDiscount}