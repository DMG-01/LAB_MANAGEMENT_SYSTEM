const express = require("express")
const patientRouter = express.Router()

const {registerPatient,getOnePatient,getAllPatient} = require("../controllers/patient")


patientRouter.route("/patientSignUp").post(registerPatient)
patientRouter.route("/Patient/:id").get(getOnePatient)
patientRouter.route("/patients/:id").get(getAllPatient)



module.exports = patientRouter