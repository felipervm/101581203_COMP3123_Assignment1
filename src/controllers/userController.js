const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

function signToken(user) {
  return jwt.sign(
    {
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      subject: user._id.toString(),
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    }
  );
}

async function signup(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const duplicate = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() },
      ],
    });

    if (duplicate) {
      const field =
        duplicate.username === username.toLowerCase() ? "username" : "email";

      logger.warn("Signup rejected: duplicate user", { field });

      return res.status(409).json({
        success: false,
        message: `A user with this ${field} already exists`,
      });
    }

    const user = await User.create({ username, email, password });

    logger.info("User registered", { userId: user._id.toString() });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const filter = username
      ? { username: username.toLowerCase() }
      : { email: email.toLowerCase() };

    const user = await User.findOne(filter).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      logger.warn("Login failed", {
        identifierType: username ? "username" : "email",
      });

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = signToken(user);

    logger.info("Login successful", { userId: user._id.toString() });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { signup, login };
