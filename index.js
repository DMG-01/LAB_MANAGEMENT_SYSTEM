const express = require("express")
const app = express()
const connectDb = require("./db/connect")
require("dotenv").config()

const staffRouter = require("./Routes/staffRoute")

app.use(express.json())

app.use("/patientSignUp",staffRouter)

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