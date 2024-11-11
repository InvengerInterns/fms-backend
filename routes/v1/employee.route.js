import express from 'express';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeDetails,
  updateEmployeeStatus,
} from '../../controllers/employee.controller.js';
import { allowedTo, protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// create Employee Route

router.post('/add-employee', protect, allowedTo('admin'), createEmployee);

// Get All Employee Route

router.get('/get-all-employees', protect, allowedTo('admin'), getAllEmployees);

// Get Employee By Id Route

router.get(
  '/get-employee/:employeeId',
  protect,
  allowedTo('admin'),
  getEmployeeById
);

// Update Employee Details Route

router.put(
  '/update-employee-details/:employeeId',
  protect,
  allowedTo('admin'),
  updateEmployeeDetails
);

// Update Employee Status Route

router.put(
  '/update-employee-status/:employeeId',
  protect,
  allowedTo('admin'),
  updateEmployeeStatus
);

export default router;
