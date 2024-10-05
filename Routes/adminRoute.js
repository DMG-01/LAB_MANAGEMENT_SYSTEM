const express = require("express")
const adminRouter = express.Router()

const {createService,getOneService,changeServicePrice} = require("../controllers/services")

adminRouter.route("/createService").post(createService)
adminRouter.route("/getAService/:id").get(getOneService)
adminRouter.route("/changePrice/:id").patch(changeServicePrice)

module.exports = adminRouter