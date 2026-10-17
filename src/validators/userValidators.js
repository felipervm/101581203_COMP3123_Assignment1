const { body } = require("express-validator");

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;

const signupValidators = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[A-Za-z0-9_.-]+$/)
    .withMessage("Username contains invalid characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail()
    .isLength({ max: 120 })
    .withMessage("Email is too long"),
  body("password")
    .isString()
    .matches(passwordRule)
    .withMessage(
      "Password must be 8-72 characters and include uppercase, lowercase, and a number"
    ),
];

const loginValidators = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),
  body("password")
    .isString()
    .notEmpty()
    .withMessage("Password is required"),
  body().custom((value) => {
    if (!value.username && !value.email) {
      throw new Error("Username or email is required");
    }
    return true;
  }),
];

module.exports = { signupValidators, loginValidators };
