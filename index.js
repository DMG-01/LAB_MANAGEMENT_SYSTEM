const express = require("express")
const app = express()
const connectDb = require("./db/connect")
require("dotenv").config()

const patientRouter = require("./Routes/staffRoute")
const adminRouter = require("./Routes/adminRoute")
const hospitalRouter = require("./Routes/hospitalRoutes")
const authRouter = require("./Routes/auth")

const authentication = require("./middleware/authentication")

app.use(express.json())

app.use("/staff",patientRouter)// change this url
app.use("/admin",adminRouter)
app.use("/hospital",hospitalRouter)
app.use("/auth",authentication, authRouter)

const port = 5500

app.get("/", (req,res)=> {
    res.send("home")
})
const start = async ()=> {
        try {
            await connectDb(process.env.MONGO_URI)
            app.listen(port,()=> {
                console.log(`app is listening on port ${port}...`)
            })
        }catch(error){
                console.log(error)
        }
}

start()