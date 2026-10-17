const Employee = require("../models/Employee");
const logger = require("../utils/logger");

async function ownershipResult(employeeId, userId) {
  const employee = await Employee.findById(employeeId);

  if (!employee) {
    return { status: 404, message: "Employee not found" };
  }

  if (employee.user.toString() !== userId) {
    return {
      status: 403,
      message: "You are not authorized to access this employee",
    };
  }

  return { employee };
}

async function getEmployees(req, res, next) {
  try {
    const employees = await Employee.find({ user: req.user.id }).sort({
      created_at: -1,
    });

    return res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    next(error);
  }
}

async function createEmployee(req, res, next) {
  try {
    const employee = await Employee.create({
      ...req.body,
      user: req.user.id,
    });

    logger.info("Employee created", {
      employeeId: employee._id.toString(),
      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    next(error);
  }
}

async function getEmployeeById(req, res, next) {
  try {
    const result = await ownershipResult(req.params.eid, req.user.id);

    if (!result.employee) {
      logger.warn("Employee access rejected", {
        employeeId: req.params.eid,
        userId: req.user.id,
        status: result.status,
      });

      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      employee: result.employee,
    });
  } catch (error) {
    next(error);
  }
}

async function updateEmployee(req, res, next) {
  try {
    const result = await ownershipResult(req.params.eid, req.user.id);

    if (!result.employee) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    Object.assign(result.employee, req.body);
    await result.employee.save();

    logger.info("Employee updated", {
      employeeId: result.employee._id.toString(),
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: result.employee,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const result = await ownershipResult(req.query.eid, req.user.id);

    if (!result.employee) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    await result.employee.deleteOne();

    logger.info("Employee deleted", {
      employeeId: req.query.eid,
      userId: req.user.id,
    });

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
