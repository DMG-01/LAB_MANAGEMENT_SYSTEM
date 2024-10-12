const {adminFirstSignUp,registerAStaff,returnAllStaff,staffLogin,removeAStaff} = require("../controllers/authentication")
const express = require("express")

const authRouter = express.Router() 

authRouter.route("/adminSignUp").post(adminFirstSignUp)
authRouter.route("/registerAStaff").post(registerAStaff)
authRouter.route("/allStaffs").get(returnAllStaff)
authRouter.route("/staffLogin").post(staffLogin)
authRouter.route("/deleteAStaff").delete(removeAStaff)

module.exports = authRouter