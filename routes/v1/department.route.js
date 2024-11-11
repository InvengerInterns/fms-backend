import {
  createDepartment,
  updateDepartmentDetails,
} from '../../controllers/department.controller.js';
import express from 'express';
import { allowedTo, protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/add-department', protect, allowedTo('admin'), createDepartment);

//update ManagerId or Department name
router.put(
  '/update-department/:deparmentId',
  protect,
  allowedTo('admin'),
  updateDepartmentDetails
);
