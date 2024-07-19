import express from 'express';
import {
  registerUser,
  getUserByEmployeeId,
  createPassword,
} from '../../controllers/user.controller.js';

const router = express.Router();

//Register Route
router.post('/add-user', registerUser);
//Register or Change Password
router.put('/password-update', createPassword);
//Get User Route
router.get('/get-user/:employeeId', getUserByEmployeeId);

export default router;
