const { body, param, query } = require("express-validator");

const employeeBodyValidators = [
  body("first_name")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name is required and must be at most 50 characters"),
  body("last_name")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name is required and must be at most 50 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid employee email is required")
    .normalizeEmail()
    .isLength({ max: 120 })
    .withMessage("Employee email is too long"),
  body("position")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Position is required and must be at most 100 characters"),
  body("salary")
    .isFloat({ gt: 0 })
    .withMessage("Salary must be a positive number")
    .toFloat(),
  body("date_of_joining")
    .isISO8601({ strict: true })
    .withMessage("Date of joining must be a valid ISO date")
    .toDate(),
  body("department")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Department is required and must be at most 100 characters"),
  body("user")
    .not()
    .exists()
    .withMessage("Employee owner cannot be supplied by the client"),
];

const employeeIdParamValidator = [
  param("eid")
    .isMongoId()
    .withMessage("Employee id must be a valid MongoDB ObjectId"),
];

const employeeIdQueryValidator = [
  query("eid")
    .isMongoId()
    .withMessage("eid query parameter must be a valid MongoDB ObjectId"),
];

module.exports = {
  employeeBodyValidators,
  employeeIdParamValidator,
  employeeIdQueryValidator,
};
