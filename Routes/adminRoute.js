const express = require("express")
const adminRouter = express.Router()

const {createService,getOneService,changeServicePrice,getAllServices,deleteAService} = require("../controllers/services")

adminRouter.route("/createService").post(createService)
adminRouter.route("/getAService/:id").get(getOneService)
adminRouter.route("/changePrice/:id").patch(changeServicePrice)
adminRouter.route("/allServices").get(getAllServices)
adminRouter.route("/deleteService/:id").delete(deleteAService)

module.exports = adminRouter