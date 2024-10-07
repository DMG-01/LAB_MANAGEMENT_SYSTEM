
const patient = require("../models/patient")
const  statusCodes = require("http-status-codes")

const registerPatient = async (req, res) => {
    const { firstName, lastName, phoneNumber, email, service, referredFrom,methodOfPayment } = req.body;
    
    try {
        let patientDetails = await patient.findOne({ phoneNumber }).populate("service.serviceId");

        if (!patientDetails) {
            // Create a new patient if they don't already exist
            const newPatient = await patient.create({
                firstName,
                lastName,
                phoneNumber,
                email,
                service,  // Ensure service is an array with valid serviceId
                referredFrom,
                methodOfPayment
            });
            return res.status(statusCodes.CREATED).json({ newPatient });
        } else {
            // If patient exists, add the new service to the array
            patientDetails.service.push(...service);  // Spread operator to add new services
            await patientDetails.save();
            return res.status(statusCodes.OK).json({ patientDetails });
        }
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
};

const getTotalAmount = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Convert startDate and endDate to valid date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Fetch all patients with populated serviceId
        const patients = await patient.find({
            "service.serviceTime": { $gte: start, $lte: end } // Filter services within the time range
        }).populate("service.serviceId");

        // Initialize totalAmount to sum the prices
        let totalAmount = 0;

        patients.forEach(p => {
            p.service.forEach(s => {
                // Only sum up services within the given time frame
                if (s.serviceTime >= start && s.serviceTime <= end && s.serviceId && s.serviceId.price) {
                    totalAmount += s.serviceId.price;
                }
            });
        });

        res.status(200).json({ totalAmount });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};


const getOnePatient = async (req,res)=> {
    try {
        const _patient = await patient.find({_id:req.params.id}).populate("service.serviceId")
        if(!_patient) {
            return res.status(statusCodes.NOT_FOUND).json({msg:`no patient with id ${req.params.id} found`})
        }
        return res.status(statusCodes.OK).json({_patient})

    }catch(error){
        return res.status(statusCodes.INTERNAL_SERVER_ERROR)
    }
}

const getAllPatient = async (req, res) => {
    try {
      const { timestamp, serviceId, methodOfPayment } = req.query;
      
      // Initialize the query with a possible filter for methodOfPayment
      let query = patient.find(methodOfPayment ? { "service.methodOfPayment": methodOfPayment } : {}).populate("service.serviceId");
  
      // Apply sorting based on serviceId or timestamp if specified
      if (serviceId) {
        query = query.sort("service.serviceId");
      } else if (timestamp) {
        query = query.sort("timestamps");
      }
  
      const _patients = await query;
  
      // Handle case where no patient data is found
      if (!_patients || _patients.length === 0) {
        return res.status(statusCodes.NOT_FOUND).json({ msg: "No patient data found" });
      }
  
      // Return the patient data along with the count
      const numberOfPatient = _patients.length;
      res.status(statusCodes.OK).json({ _patients, numberOfPatient });
    
    } catch (error) {
      // Handle internal server errors
      res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };
  
  



module.exports = {registerPatient,getOnePatient,getAllPatient,getTotalAmount}