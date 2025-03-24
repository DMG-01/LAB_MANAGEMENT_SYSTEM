const patient = require("../models/patient");
const hospitalDiscount = require("../models/hospitalDiscount");
const statusCodes = require("http-status-codes");
const register = require("../models/register");

// add to the register
// validates the amount -- might change this since the amount would be whole
// handle referral logic 
// patient look up and creating a new patient or adding to their list of service

const registerPatient = async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    service,
    _methodOfPayment,
    amountPaid,
    referredFrom,
  } = req.body;

  try {
    console.log(`Adding patient to the database`);

    let registerNumber = await register.countDocuments();
    console.log(registerNumber);

    let patientInRegister = await register.create({
      labNumber: ++registerNumber,
      FirstName: firstName,
      LastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      service: service,
      amountPaid: amountPaid,
      methodOfPayment: _methodOfPayment,
    });

    console.log(`Patient added to the register`);
    console.log(`Handling referral`);

    if (referredFrom) {
      const referral = await hospitalDiscount.findOne({ _id: referredFrom });
      const updatedAmount = (referral?.totalAmount || 0) + amountPaid;

      await hospitalDiscount.findOneAndUpdate(
        { _id: referredFrom },
        {
          totalAmount: updatedAmount,
          totalDiscount: Number((10 / 100) * updatedAmount),
        }
      );
    } else {
      console.log(`Referred from private`);
    }

    console.log(`Referral handled`);
    console.log(`Patient lookup and service handling`);

    let patientDetails = await patient.findOneAndUpdate(
      {
        firstName,
        lastName,
        phoneNumber,
      },
      {
        $push: { labNumbers: registerNumber },
      }
    );

    if (!patientDetails) {
      patientDetails = await patient.create({
        firstName,
        lastName,
        phoneNumber,
        email,
        service,
      });
      console.log(`New patient created`);
    }

    return res
      .status(statusCodes.OK)
      .json({ msg: `Patient registered successfully`, patientDetails, patientInRegister });
  } catch (error) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `Error registering patient: ${error.message}` });
  }
};


const getTotalAmount = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ msg: "Please provide both startDate and endDate" });
    }

    
    const start = new Date(startDate);
    const end = new Date(endDate);

    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ msg: "Invalid date format" });
    }

   let patientInRegister = await register.find({
    Time: {$gte:start, $lte:end}
   })

   let totalAmount = 0

   patientInRegister.forEach((patient)=> {
    totalAmount += patient.amountPaid
   })

   return res.status(200).json({msg:`Total amount paid between ${start} and ${end} is ${totalAmount}`, patients:patientInRegister})
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR);
  }
};


const getOnePatient = async (req, res) => { 
  return 0
}

const getAllPatient = async (req, res) => {
  try {
    const { timestamp, serviceId, methodOfPayment } = req.query;

    // Initialize the query with a possible filter for methodOfPayment
    let query = patient
      .find(
        methodOfPayment ? { "service.methodOfPayment": methodOfPayment } : {}
      )
      .populate("service.serviceId");

    // Apply sorting based on serviceId or timestamp if specified
    if (serviceId) {
      query = query.sort("service.serviceId");
    } else if (timestamp) {
      query = query.sort("timestamps");
    }

    const _patients = await query;

    // Handle case where no patient data is found
    if (!_patients || _patients.length === 0) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ msg: "No patient data found" });
    }

    // Return the patient data along with the count
    const numberOfPatient = _patients.length;
    res.status(statusCodes.OK).json({ _patients, numberOfPatient });
  } catch (error) {
    // Handle internal server errors
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

module.exports = {
  registerPatient,
  getOnePatient,
  getAllPatient,
  getTotalAmount,
};
