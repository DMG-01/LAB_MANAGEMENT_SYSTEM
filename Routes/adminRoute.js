const express = require("express")
const adminRouter = express.Router()

const {createService,getOneService,changeServicePrice} = require("../controllers/services")

adminRouter.route("/createService").post(createService)
adminRouter.route("/getAService").get(getOneService)
adminRouter.route("changePrice").patch(changeServicePrice)

module.exports = adminRouter