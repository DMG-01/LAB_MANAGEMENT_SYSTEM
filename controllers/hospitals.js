const patient = require("../models/patient");
const statusCodes = require("http-status-codes");

const calculateDiscount = async (req, res) => {
    try {
        const { referredFrom } = req.query;

        // Find patients with services referred from the specified source
        const patientsReferredFrom = await patient.find({ "service.referredFrom": referredFrom });

        if (patientsReferredFrom.length === 0) {
            return res.status(statusCodes.NOT_FOUND).json({ msg: `No patients referred from ${referredFrom}` });
        }

        // Initialize totalAmount
        let totalAmount = 0;

        // Iterate over each patient
        for (let index = 0; index < patientsReferredFrom.length; index++) {
            const patient = patientsReferredFrom[index];

            // Iterate over each service
            for (let j = 0; j < patient.service.length; j++) {
                let service = patient.service[j];

                // Sum only the services that are referred from "peaceful health"
                if (service.referredFrom === referredFrom) {
                    totalAmount += service.amountPaid;
                }
            }
        }

        // Calculate 10% discount
        const discount = (10 / 100) * totalAmount;

        res.status(statusCodes.OK).json({
            msg: `The total discount for referrals from ${referredFrom} is ${discount}`,
            totalAmount,
        });
    } catch (error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
};

module.exports = { calculateDiscount };
