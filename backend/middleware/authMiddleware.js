const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../db/models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decodedToken.id).select("-password");
      next();
    } catch (err) {
      throw new Error("Not authorized, token failed");
    }
  } else throw new Error("Not authorized, token failed");
});

module.exports = { protect };
