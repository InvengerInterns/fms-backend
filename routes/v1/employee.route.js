import express from 'express';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  getEmployeeClientHistory,
  updateEmployeeDetails,
  updateEmployeeStatus,
} from '../../controllers/employee.controller.js';
import { allowedTo, permittedTo, protect } from '../../middlewares/auth.middleware.js';
import fileUploadMiddleware from '../../middlewares/filehandle.middleware.js';
import { accessControls, permission_Ids } from '../../constants.js';

const router = express.Router();

// create Employee Route

router.post(
  '/add-employee',
  protect,
  allowedTo('admin'),
  fileUploadMiddleware,
  createEmployee
);

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
  fileUploadMiddleware,
  updateEmployeeDetails
);

// Update Employee Status Route
router.put(
  '/update-employee-status/:employeeId',
  protect,
  allowedTo('admin'),
  fileUploadMiddleware,
  updateEmployeeStatus
);

//Get Client-History
router.get(
  '/get-employee-client-history/:employeeId',
  protect,
  allowedTo('admin', 'super-admin'),
  permittedTo({permission: permission_Ids.CLIENT_HISTORY ,action:[accessControls.MODIFY, accessControls.WRITE, accessControls.READ]}),
  getEmployeeClientHistory
);

export default router;
