const express = require("express");
const authenticate = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  employeeBodyValidators,
  employeeIdParamValidator,
  employeeIdQueryValidator,
} = require("../validators/employeeValidators");
const {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const router = express.Router();

router.use(authenticate);

router
  .route("/employees")
  .get(getEmployees)
  .post(employeeBodyValidators, validate, createEmployee)
  .delete(employeeIdQueryValidator, validate, deleteEmployee);

router
  .route("/employees/:eid")
  .get(employeeIdParamValidator, validate, getEmployeeById)
  .put(
    employeeIdParamValidator,
    employeeBodyValidators,
    validate,
    updateEmployee
  );

module.exports = router;
