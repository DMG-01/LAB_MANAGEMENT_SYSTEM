const patient = require("../models/patient")
const  statusCodes = require("http-status-codes")

const registerPatient = async (req, res) => {
    const { firstName, lastName, phoneNumber, email, service, referredFrom } = req.body;
    
    try {
        let patientDetails = await patient.findOne({ phoneNumber }).populate("service");

        if (!patientDetails) {

            const newPatient = await patient.create({
                firstName,
                lastName,
                phoneNumber,
                email,
                service,  // Ensure service is an array with valid serviceId
                referredFrom
            });
            return res.status(statusCodes.CREATED).json({ newPatient });
        } else {
            // If patient exists, add the new service to the array
            patientDetails.service.push(...service);  // Use spread operator to add service objects
            await patientDetails.save();
            return res.status(statusCodes.OK).json({ patientDetails });
        }
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
};


const returnPatient = async (req,res)=> {
    res.send("patient")
}


module.exports = {registerPatient,returnPatient}