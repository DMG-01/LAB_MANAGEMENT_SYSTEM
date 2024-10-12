const {adminFirstSignUp} = require("../controllers/authentication")
const express = require("express")

const authRouter = express.Router() 

authRouter.route("/adminSignUp").post(adminFirstSignUp)


module.exports = authRouter