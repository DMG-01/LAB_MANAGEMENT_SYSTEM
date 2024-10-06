const express = require("express")
const patientRouter = express.Router()

const {registerPatient,getOnePatient,getAllPatient,getTotalAmount} = require("../controllers/patient")


patientRouter.route("/patientSignUp").post(registerPatient)
patientRouter.route("/patient/:id").get(getOnePatient)
patientRouter.route("/patients").get(getAllPatient)
patientRouter.route("/totalAmount").get(getTotalAmount)



module.exports = patientRouter