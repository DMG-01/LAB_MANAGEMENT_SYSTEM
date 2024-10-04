const express = require("express")
const staffRouter = express.Router()

const {registerPatient,} = require("../controllers/patient")

staffRouter.route("/").post(registerPatient)

module.exports = staffRouter