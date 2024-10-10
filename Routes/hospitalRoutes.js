const {calculateDiscount, returnAllHospitalAndDiscount} = require("../controllers/hospitals")
const express = require("express")
const hospitalRouter = express.Router()

hospitalRouter.route("/hospitalDiscount").get(calculateDiscount)
hospitalRouter.route("/allHospitalDiscount").get(returnAllHospitalAndDiscount)


module.exports = hospitalRouter