const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.userId;
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        message: "User does not exist, please login again!",
        success: false,
      });
    }
    next();
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
};
