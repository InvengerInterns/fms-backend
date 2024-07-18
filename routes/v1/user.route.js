import express from 'express';
import {
  registerUser,
  getUserByEmployeeId,
} from '../../controllers/user.controller.js';

const router = express.Router();

//Register Route
router.post('/add-user', registerUser);
//Get User Route
router.get('/get-user/:employeeId', getUserByEmployeeId);

export default router;
