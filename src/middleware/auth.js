const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      logger.warn("Authorization failed: missing bearer token", {
        method: req.method,
        path: req.originalUrl,
      });
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    const token = header.slice(7).trim();
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub);

    if (!user) {
      logger.warn("Authorization failed: token user not found", {
        userId: decoded.sub,
      });
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    };

    next();
  } catch (error) {
    logger.warn("Authorization failed: token rejected", {
      reason: error.name,
      path: req.originalUrl,
    });

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authentication token has expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid authentication token",
    });
  }
}

module.exports = authenticate;
