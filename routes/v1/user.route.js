import express from 'express';
import {
  registerUser,
  getUserByEmployeeId,
  createPassword,
  deleteUserByEmployeeId,
  loginUser,
  logoutUser,
  sendOtp,
  verifyOtp,
  getCurrentUser,
  getAllUsers,
} from '../../controllers/user.controller.js';
import { allowedTo, protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

//Register Route
router.post('/add-user', registerUser);
//Register or Change Password
router.put('/password-update', createPassword);
//Login User
router.post('/login-user', loginUser);
//Get User Route
router.get('/get-user/:employeeId', protect, allowedTo('admin'), getUserByEmployeeId);
//Get All Users
router.get('/get-users', protect, allowedTo('admin'), getAllUsers);
//Get current user
router.get('/get-me', protect, getCurrentUser);
//Delete User by employeeId
router.put('/delete-user/:employeeId', protect,  allowedTo('admin'), deleteUserByEmployeeId);
//Logout User
router.post('/logout-user', protect, logoutUser);
//Send OTP via Mail
router.post('/send-otp', protect, sendOtp);
//Verify OTP
router.post('/verify-otp/:email', protect, verifyOtp);

export default router;
