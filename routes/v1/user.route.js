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
  getAllUsers,
} from '../../controllers/user.controller.js';

const router = express.Router();

//Register Route
router.post('/add-user', registerUser);
//Register or Change Password
router.put('/password-update', createPassword);
//Login User
router.post('/login-user', loginUser);
//Get User Route
router.get('/get-user/:employeeId', getUserByEmployeeId);
//Get All Users
router.get('/get-users', getAllUsers);
//Delete User Route
router.put('/delete-user/:employeeId', deleteUserByEmployeeId);
//Logout User
router.post('/logout-user', logoutUser);
//Send OTP via Mail
router.post('/send-otp', sendOtp);
//Verify OTP
router.post('/verify-otp/:email', verifyOtp);

export default router;
