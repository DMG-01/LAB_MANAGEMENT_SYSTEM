const patient = require("../models/patient");
const hospitalDiscount = require("../models/hospitalDiscount");
const statusCodes = require("http-status-codes");
const register = require("../models/register");

// add to the register
// validates the amount -- might change this since the amount would be whole
// handle referral logic 
// patient look up and creating a new patient or adding to their list of service

const registerPatient = async (req, res) => {
  const { firstName, lastName, phoneNumber, email, service, _methodOfPayment } = req.body;


  try {
  console.log(`adding patient to the database`)
  let registerNumber = await register.countDocuments()
  console.log(registerNumber)

  let patientInRegister = await register.create({
    labNumber:registerNumber++,
    

  })
  }catch(error)
 {
  return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({msg:`error registering patient ${error}`})
 }


























/*

  // Validate amountPaid for each service
  for (const s of service) {
    const parsedAmountPaid = Number(s.amountPaid);
    if (isNaN(parsedAmountPaid)) {
      return res.status(400).json({ msg: "Invalid amountPaid, must be a valid number in each service" });
    }
    totalAmount += parsedAmountPaid;
  }

  // Handle referral logic
  const referredFrom = service[0]?.referredFrom || "private";
  try {
    if (referredFrom !== "private") {
      let referral = await hospitalDiscount.findOne({ Name: referredFrom });

      if (!referral) {
        referral = new hospitalDiscount({
          Name: referredFrom,
          totalAmount,
          totalDiscount: Number((10 / 100) * totalAmount),
        });
        await referral.save();
        console.log(`New referral created: ${referredFrom}`);
      } else {
        referral.totalAmount += totalAmount;
        referral.totalDiscount += Number((10 / 100) * totalAmount);
        await referral.save();
        console.log(`Updated referral: ${referredFrom}`);
      }
    } else {
      console.log("Referred from private");
    }

    // Patient lookup and service handling
    let patientDetails = await patient.findOne({
      firstName,
      lastName,
      phoneNumber,
    }).populate("service.serviceId");

    let newServices = [];

    if (!patientDetails) {
      patientDetails = await patient.create({
        firstName,
        lastName,
        phoneNumber,
        email,
        service,
      });
      newServices = service;
    } else {
      // Track and add only new services
      const existingServiceIds = patientDetails.service.map((s) => s.serviceId.toString());

      service.forEach((s) => {
        if (s.serviceId && s.amountPaid && !existingServiceIds.includes(s.serviceId.toString())) {
          patientDetails.service.push(s);
          newServices.push(s);
        }
      });
      await patientDetails.save();
    }

    console.log("New services added:", newServices);

    // Auto-increment lab number
    let regNumber = await register.countDocuments() + 1;
    console.log(`Number of registered patients: ${regNumber}`);

    const serviceForRegister = service.map((s)=> ({
      serviceId :s.serviceId,
      values:[]
    }))
     console.log(serviceForRegister)
 

    await register.create({
      labNumber: regNumber++,
      patientId: patientDetails._id,
      service: serviceForRegister,
      amountPaid: totalAmount,
      methodOfPayment: _methodOfPayment
    });
    

    return res.status(201).json({
      msg: "Patient registered successfully",
      firstName,
      lastName,
      phoneNumber,
      email,
      newServices,
      labNumber: regNumber,
    });
  } catch (error) {
    console.error(`Error registering patient: ${error.message}`);
    return res.status(500).json({ msg: `Error registering patient: ${error.message}` });
  }
    */
};

  
  

const getTotalAmount = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Check if dates are provided
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ msg: "Please provide both startDate and endDate" });
    }

    // Convert startDate and endDate to valid Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ensure valid date conversion
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ msg: "Invalid date format" });
    }

    // Fetch all patients with services in the time range and populated serviceId
    const patients = await patient
      .find({
        "service.serviceTime": { $gte: start, $lte: end },
      })
      .populate("service.serviceId");

    // Initialize totalAmount to sum the prices
    let totalAmount = 0;

    // Sum up the amountPaid for services within the specified date range
    patients.forEach((p) => {
      if (Array.isArray(p.service)) {
        p.service.forEach((s) => {
          if (
            s.serviceTime >= start &&
            s.serviceTime <= end &&
            s.serviceId &&
            typeof s.amountPaid === "number"
          ) {
            totalAmount += s.amountPaid;
          }
        });
      }
    });

    // Send the response with the total amount
    res.status(200).json({ totalAmount });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getOnePatient = async (req, res) => {
  try {
    const _patient = await patient
      .findOne({ _id: req.params.id })
      .populate("service.serviceId");
    if (!_patient) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ msg: `no patient with id ${req.params.id} found` });
    }
    return res.status(statusCodes.OK).json({ _patient });
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR);
  }
};

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
