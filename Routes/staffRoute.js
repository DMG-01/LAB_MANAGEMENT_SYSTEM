const express = require("express")
const patientRouter = express.Router()

const {registerPatient,getOnePatient,getAllPatient} = require("../controllers/patient")


patientRouter.route("/patientSignUp").post(registerPatient)
patientRouter.route("/patient/:id").get(getOnePatient)
patientRouter.route("/patients").get(getAllPatient)



module.exports = patientRouter