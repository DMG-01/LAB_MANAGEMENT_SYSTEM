const {adminFirstSignUp,registerAStaff,returnAllStaff,staffLogin} = require("../controllers/authentication")
const express = require("express")

const authRouter = express.Router() 

authRouter.route("/adminSignUp").post(adminFirstSignUp)
authRouter.route("/registerAStaff").post(registerAStaff)
authRouter.route("/allStaffs").get(returnAllStaff)
authRouter.route("/staffLogin").post(staffLogin)


module.exports = authRouter