const express = require("express")
const app = express()
const connectDb = require("./db/connect")
require("dotenv").config()

const staffRouter = require("./Routes/staffRoute")
const adminRouter = require("./Routes/adminRoute")

app.use(express.json())

app.use("/staff",staffRouter)// change this url
app.use("/admin",adminRouter)

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