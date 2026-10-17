const { validationResult } = require("express-validator");
const logger = require("../utils/logger");

function validate(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));

  logger.warn("Validation failed", {
    method: req.method,
    path: req.originalUrl,
    fields: errors.map((item) => item.field),
  });

  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors,
  });
}

module.exports = validate;
