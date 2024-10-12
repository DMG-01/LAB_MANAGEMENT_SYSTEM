const {adminFirstSignUp,registerAStaff,returnAllStaff} = require("../controllers/authentication")
const express = require("express")

const authRouter = express.Router() 

authRouter.route("/adminSignUp").post(adminFirstSignUp)
authRouter.route("/registerAStaff").post(registerAStaff)
authRouter.route("/allStaffs").get(returnAllStaff)


module.exports = authRouter