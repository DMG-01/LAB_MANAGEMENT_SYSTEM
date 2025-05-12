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
  
  try {
   let searchQuery = []

   if (req.body.firstName){
    searchQuery.push({firstName:req.body.firstName})
   }

   if(req.body.lastName) {
    searchQuery.push({lastName:req.body.lastName})
   }

   if(req.body.phoneNumber) {
    searchQuery.push({phoneNumber:req.body.phoneNumber})
   }

   if(req.body.email) {
    searchQuery.push({email:req.body.email})
   }

   let patientDetails = await patient.find({
    $or: searchQuery.length ? searchQuery : [{}]
   })

   return(res.status(statusCodes.OK)).json({msg:`Patient found`, patientDetails})
  }catch(error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({msg:error})
  }
}






module.exports = {
  registerPatient,
  getOnePatient,
  getTotalAmount,
};
