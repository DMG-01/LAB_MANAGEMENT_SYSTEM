const {adminFirstSignUp,registerAStaff} = require("../controllers/authentication")
const express = require("express")

const authRouter = express.Router() 

authRouter.route("/adminSignUp").post(adminFirstSignUp)
authRouter.route("/registerAStaff").post(registerAStaff)


module.exports = authRouter