const express = require("express")
const staffRouter = express.Router()

const {registerPatient,} = require("../controllers/patient")


staffRouter.route("/patientSignUp").post(registerPatient)


module.exports = staffRouter