const patient = require("../models/patient")

const registerPatient = async (req,res)=> {
res.send("register")
}

const returnPatient = async (req,res)=> {
    res.send("patient")
}


module.exports = {registerPatient,returnPatient}