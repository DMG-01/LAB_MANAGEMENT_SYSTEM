const express = require("express")
const app = express()
const statusCodes = require("http-status-codes")


app.use(express.json())

const port = 5500

app.get("/", (req,res)=> {
    res.send("home")
})
const start = ()=> {
        try {
            app.listen(port,()=> {
                console.log(`app is listening on port ${port}...`)
            })
        }catch(error){
                console.log(error)
        }
}

start()