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
  addUserWithEmployeeId,
  getRefreshToken,
  assignPermissions,
} from '../../controllers/user.controller.js';
import { allowedTo, protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

//Register Route
router.post('/add-user', registerUser);
//Register User Route
router.post(
  '/register-user/:employeeId',
  protect,
  allowedTo('admin', 'super-admin'),
  addUserWithEmployeeId
);
//Register or Change Password
router.put('/password-update', createPassword);
//Login User
router.post('/login-user', loginUser);
//Trigger Refresh Token
router.post('/refresh-token', protect, getRefreshToken);
//Get User Route
router.get(
  '/get-user/:employeeId',
  protect,
  allowedTo('super-admin','admin'),
  getUserByEmployeeId
);
//Get All Users
router.get('/get-users', protect, allowedTo('super-admin','admin'), getAllUsers);
//Get current user
router.get('/get-me', protect, getCurrentUser);
//Delete User by employeeId
router.put(
  '/delete-user/:employeeId',
  protect,
  allowedTo('super-admin'),
  deleteUserByEmployeeId
);
//Logout User
router.post('/logout-user', protect, logoutUser);
//Send OTP via Mail
router.post('/send-otp', sendOtp);
//Verify OTP
router.post('/verify-otp/:email', verifyOtp);
//Assign Permission to users
router.put('/assign-permission', protect, allowedTo('super-admin'),assignPermissions);

export default router;
