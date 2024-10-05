const express = require("express")
const adminRouter = express.Router()

const {createService,getOneService,changeServicePrice,getAllServices} = require("../controllers/services")

adminRouter.route("/createService").post(createService)
adminRouter.route("/getAService/:id").get(getOneService)
adminRouter.route("/changePrice/:id").patch(changeServicePrice)
adminRouter.route("/allServices").get(getAllServices)

module.exports = adminRouter