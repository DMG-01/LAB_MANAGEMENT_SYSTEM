const express = require("express")
const patientRouter = express.Router()

const serviceRouter = express.Router()

const {registerPatient,getOnePatient,getAllPatient,getTotalAmount} = require("../controllers/patient")
const {modifyAserviceProperties,removeServiceProperties,uploadAPatientResult} = require("../controllers/staffs")


patientRouter.route("/patientSignUp").post(registerPatient)
patientRouter.route("/patient/").get(getOnePatient)
patientRouter.route("/totalAmount").get(getTotalAmount)

serviceRouter.route("/modifyServiceProperty/:id").post(modifyAserviceProperties)
serviceRouter.route("/removeServiceProperty/:id").delete(removeServiceProperties)
serviceRouter.route("/uploadResult/:id/:serviceId").post(uploadAPatientResult)




module.exports = {patientRouter, serviceRouter}