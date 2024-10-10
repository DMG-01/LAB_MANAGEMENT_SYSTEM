const mongoose = require("mongoose");

const hospitalDiscountSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true,"enter nname"],
        unique: true
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    accountNumber: {
        type: String
    },
    totalDiscount: {
        type: Number,
        required: true,
        default: 0
    },
    totalDiscountPayed: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true }); // Corrected timestamp field

module.exports = mongoose.model("HospitalDiscount", hospitalDiscountSchema);
