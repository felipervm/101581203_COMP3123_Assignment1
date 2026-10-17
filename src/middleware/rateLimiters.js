const rateLimit = require("express-rate-limit");

const json429 = {
  success: false,
  message: "Too many requests. Please try again later.",
};

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json(json429),
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json(json429),
});

module.exports = { authLimiter, apiLimiter };
