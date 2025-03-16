const express = require("express")
const patientRouter = express.Router()

const serviceRouter = express.Router()

const {registerPatient,getOnePatient,getAllPatient,getTotalAmount} = require("../controllers/patient")
const {modifyAserviceProperties,removeServiceProperties} = require("../controllers/staffs")


patientRouter.route("/patientSignUp").post(registerPatient)
patientRouter.route("/patient/:id").get(getOnePatient)
patientRouter.route("/patients").get(getAllPatient)
patientRouter.route("/totalAmount").get(getTotalAmount)

serviceRouter.route("/modifyServiceProperty/:id").post(modifyAserviceProperties)
serviceRouter.route("/removeServiceProperty/:id").delete(removeServiceProperties)




module.exports = {patientRouter, serviceRouter}