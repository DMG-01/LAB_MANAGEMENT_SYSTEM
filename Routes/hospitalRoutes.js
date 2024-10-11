const {calculateDiscount, returnAllHospitalAndDiscount, payADiscount, changeAccountNumber} = require("../controllers/hospitals")
const express = require("express")
const hospitalRouter = express.Router()

hospitalRouter.route("/hospitalDiscount").get(calculateDiscount)
hospitalRouter.route("/allHospitalDiscount").get(returnAllHospitalAndDiscount)
hospitalRouter.route("/payADiscount").patch(payADiscount)
hospitalRouter.route("/changeAcctNo").patch(changeAccountNumber)


module.exports = hospitalRouter