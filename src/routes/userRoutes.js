const express = require("express");
const { signup, login } = require("../controllers/userController");
const { signupValidators, loginValidators } = require("../validators/userValidators");
const validate = require("../middleware/validate");
const { authLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/signup", authLimiter, signupValidators, validate, signup);
router.post("/login", authLimiter, loginValidators, validate, login);

module.exports = router;
