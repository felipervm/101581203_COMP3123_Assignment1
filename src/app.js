require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const requestLogger = require("./middleware/requestLogger");
const { apiLimiter } = require("./middleware/rateLimiters");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(requestLogger);
app.use(apiLimiter);

app.use(async (req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "COMP3123 Assignment 1 API",
    health: "/health",
  });
});

app.get("/health", (_req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];

  res.status(200).json({
    success: true,
    status: "ok",
    database: states[mongoose.connection.readyState] || "unknown",
    uptime_seconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
