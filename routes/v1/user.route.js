import express from 'express';
import {
  registerUser,
  getUserByEmployeeId,
  createPassword,
  deleteUserByEmployeeId
} from '../../controllers/user.controller.js';

const router = express.Router();

//Register Route
router.post('/add-user', registerUser);
//Register or Change Password
router.put('/password-update', createPassword);
//Get User Route
router.get('/get-user/:employeeId', getUserByEmployeeId);
//Delete User Route
router.put('/delete-user/:employeeId', deleteUserByEmployeeId);

export default router;
