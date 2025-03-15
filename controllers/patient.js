const patient = require("../models/patient");
const hospitalDiscount = require("../models/hospitalDiscount");
const statusCodes = require("http-status-codes");

const registerPatient = async (req, res) => {
  const { firstName, lastName, phoneNumber, email, service } = req.body;

  let totalAmount = 0;

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

  if (referredFrom !== "private") {
    try {
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
    } catch (error) {
      console.error(`Referral handling failed: ${error.message}`);
    }
  } else {
    console.log("Referred from private");
  }

  try {
    let patientDetails = await patient.findOne({ phoneNumber }).populate("service.serviceId");

    let newServices = [];

    if (!patientDetails) {
      // Create new patient
      const newPatient = await patient.create({
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
          newServices.push(s); // Capture new services only
        }
      });

      await patientDetails.save();
    }

    console.log("New services added:", newServices);
    return res.status(201).json({ newServices });

  } catch (error) {
    console.error(`Error updating patient: ${error.message}`);
  }
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
      .find({ _id: req.params.id })
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
