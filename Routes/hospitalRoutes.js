const {calculateDiscount} = require("../controllers/hospitals")
const express = require("express")
const hospitalRouter = express.Router()

hospitalRouter.route("/hospitalDiscount").get(calculateDiscount)

module.exports = hospitalRouter