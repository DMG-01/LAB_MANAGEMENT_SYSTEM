const  staff  = require("../models/staffs");
const statusCodes = require("http-status-codes");
const mongoose = require("mongoose");

const levelAuthentication = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Validate if the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(statusCodes.BAD_REQUEST).json({ msg: "Invalid userId format" });
    }

    const _staff = await staff.findOne({ _id: userId });

    // Check if staff exists
    if (!_staff) {
      return res.status(statusCodes.NOT_FOUND).json({ msg: "Staff not found" });
    }

    const userLevel = _staff.level;
    console.log(userLevel);

    // Authorization check
    if (userLevel < 3) {
      return res.status(statusCodes.UNAUTHORIZED).json({ msg: "Unauthorized" });
    }

    // Proceed to next middleware
    next();
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ msgg: error.message });
  }
};

module.exports = levelAuthentication;
