const {adminFirstSignUp,registerAStaff,returnAllStaff,staffLogin,removeAStaff,changeStaffLevel} = require("../controllers/authentication")
const express = require("express")
const levelAuthentication = require("../middleware/topLevelAuthentication")

const authRouter = express.Router() 

authRouter.route("/adminSignUp").post(adminFirstSignUp)
authRouter.route("/registerAStaff/:userId").post(levelAuthentication,registerAStaff)
authRouter.route("/allStaffs").get(returnAllStaff)
authRouter.route("/staffLogin").post(staffLogin)
authRouter.route("/deleteAStaff/:userId").delete(levelAuthentication,removeAStaff)
authRouter.route("/changeLevel").patch(levelAuthentication,changeStaffLevel)

module.exports = authRouter