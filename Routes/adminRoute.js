const express = require("express")
const adminRouter = express.Router()
const topLevelAuthentication = require("../middleware/topLevelAuthentication")


const {createService,getOneService,changeServicePrice,getAllServices,deleteAService} = require("../controllers/services")

adminRouter.route("/createService/:id").post(topLevelAuthentication,createService)
adminRouter.route("/getAService/:id").get(getOneService)
adminRouter.route("/changePrice/:id").patch(topLevelAuthentication,changeServicePrice)
adminRouter.route("/allServices").get(getAllServices)
adminRouter.route("/deleteService/:id").delete(topLevelAuthentication,deleteAService)

module.exports = adminRouter