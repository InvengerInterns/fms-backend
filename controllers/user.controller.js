import {
  checkPassword,
  prepareOtp,
  hashPassword,
  isValidPassword,
} from '../utils/auth.util.js';
import { getHtmlContent } from '../utils/prepareEmailBody.util.js';
import { generateTokens, getPermissionsForUser } from '../utils/user.util.js';
import User from '../models/user.model.js';
import Employee from '../models/employee.model.js';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import sendMail from '../utils/emailSend.util.js';
import dotenv from 'dotenv';
import { getCustomQueryResults } from '../utils/customQuery.util.js';
import EmployeeProfessionalDetailsMaster from '../models/employeeProfessionalMaster.model.js';
import { encryptEmployeeId } from '../helper/filePathEncryption.helper.js';
import { decryptToken } from '../helper/token.helper.js';
import { Op } from 'sequelize';
import { createPermissions } from '../helper/user.helper.js';
import { getActiveUser } from '../models/index.model.js';

dotenv.config();

const userOTPMap = new Map();

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user by email with active status
    const user = await getActiveUser(email);

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User does not exist! Please Register.' });
    }

    console.log('User:', user);
    // Check if password matches
    const isMatching = await checkPassword(password, user.userPassword);
    if (!isMatching) {
      return res.status(401).json({ message: 'Invalid Username or Password' });
    }

    const permissions = await getPermissionsForUser(user.userId);

    // Sign JWT token with user ID, role, and permissions
    const { accessToken, refreshToken, encryptedToken, iv } =
      await generateTokens(user.userId, user.userRole, permissions);

    await User.update(
      { refreshToken: encryptedToken, refreshTokenIv: iv },
      { where: { userId: user.userId } }
    );

    // Send response with token and permissions
    return res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        maxAge: 3600000, // 1 hour expiration
      })
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: 604800000, // 1 week expiration
      })
      .status(200)
      .json({
        userAccess: user.userRole,
        message: 'User Logged In Successfully',
        permission: permissions,
      });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

//Registering User
const registerUser = async (req, res) => {
  const { email, role, password, confirmPassword, employeeId } = req.body;

  try {
    const validPassword = await isValidPassword(confirmPassword);

    if (!validPassword) {
      return res.status(404).json({
        message: 'Password is not meeting requirements',
      });
    }
    if (confirmPassword != password) {
      return res.status(404).json({
        message: 'Passwords Do Not Match!!',
      });
    }

    const hashedPassword = await hashPassword(confirmPassword);

    if (!email.endsWith('@invenger.com')) {
      return res.status(404).json({
        message: 'Usage of Work Email is preffered',
      });
    }

    const existingUser = await User.findAll({
      where: {
        userEmail: email,
      },
    });

    if (!existingUser) {
      return res.status(400).json({
        message: 'User Already Exists!!',
      });
    }

    const newUser = await User.create({
      userEmail: email,
      userPassword: hashedPassword,
      userRole: role,
      userEmployeeId: employeeId,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User Created Successfully',
      data: { email: newUser.userEmail, role: newUser.userRole },
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error` });
    throw error;
  }
};

//Add User With Employee Model
const addUserWithEmployeeId = async (req, res) => {
  const { employeeId } = req.params;
  let link;

  try {
    const employeeData = await Employee.findOne({
      where: {
        employeeId: employeeId,
      },
    });

    const employeeProfessionalData =
      await EmployeeProfessionalDetailsMaster.findOne({
        where: {
          employeeId: employeeId,
        },
      });

    const existingUser = await User.findOne({
      where: {
        userEmployeeId: employeeId,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User Already Exists!!',
      });
    }

    if (!employeeProfessionalData) {
      return res.status(404).json({
        message: 'Employee Professional Data Not Found',
      });
    }

    if (!employeeData) {
      return res.status(404).json({
        message: 'Employee Not Found',
      });
    }

    console.log('Employee Data:', employeeProfessionalData);

    const newUser = await User.create({
      userEmail: employeeProfessionalData.workEmail,
      userEmployeeId: employeeData.employeeId,
      userRole: 'admin',
    });

    await newUser.save();

    console.log('New User:', newUser);
    const newUserData = await User.findOne({
      order: [['userId', 'DESC']],
    });

    const newUserPermissions = await createPermissions(newUserData.userId);

    const encryptedEmployeeId = await encryptEmployeeId(
      employeeData.employeeId
    );
    console.log('Encrypted Employee Id:', encryptedEmployeeId);
    //link = `http://localhost:5000/api/v1/user/password-update/${employeeData.employeeId}`;
    link = `http://localhost:1234/setpassword/${encryptedEmployeeId}`;
    const htmlBody = await getHtmlContent('new-password', {
      username: employeeData.firstName,
      link: link,
    });
    const subject = 'User Password Creation FMS-TEST';
    console.log('Sending email to:-', employeeData.workEmail);
    await sendMail(employeeProfessionalData.workEmail, subject, htmlBody);

    res.status(201).json({
      message: 'User Created and Email for password creation has been Sent',
      permissions: newUserPermissions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

//Get User By EmployeeId
const getUserByEmployeeId = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const existingUserById = await User.findOne({
      where: {
        userEmployeeId: employeeId,
      },
    });

    if (existingUserById.length == 0) {
      return res.status(404).json({
        message: 'No user found with this Employee ID.',
      });
    }

    const tables = ['login_details', 'permissions_masters', 'permissions'];
    const joins = [
      {
        joinType: '',
        onCondition: 'login_details.userId = permissions_masters.userId',
      },
      {
        joinType: '',
        onCondition:
          'permissions.permissionId = permissions_masters.permissionId',
      },
    ];
    const attributes = ['permissionName', 'status'];
    const whereCondition = `login_details.userId = ${existingUserById.userId}`;

    const result = await getCustomQueryResults(
      tables,
      joins,
      attributes,
      whereCondition
    );

    const permissions = result.map((permission) => {
      return {
        permissionName: permission.permissionName,
        status: permission.status,
      };
    });

    return res.status(200).json({
      data: {
        email: existingUserById.userEmail,
        role: existingUserById.userRole,
        employeeNumber: existingUserById.employeeId,
        permissions: permissions,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

//Get All User with Status1
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users with specific attributes
    const users = await User.findAll({
      attributes: ['userEmail', 'userStatus', 'userRole'],
    });

    if (users.length === 0) {
      return res.status(404).json({
        message: 'No users found',
      });
    }
    return res.status(200).json({
      data: {
        users,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

// Function to delete user by employee ID
const deleteUserByEmployeeId = async (req, res) => {
  const { employeeId } = req.params; // Assuming employeeId is passed as a URL parameter

  try {
    const existingUser = await User.findOne({
      where: {
        userEmployeeId: employeeId,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: 'User with this Employee ID does not exist!!',
      });
    }

    await User.update(
      { userStatus: 0 },
      {
        where: {
          userEmployeeId: employeeId,
        },
      }
    );

    return res.status(200).json({
      message: 'User status updated successfully.',
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

//Password Creation
const createPassword = async (req, res) => {
  const { employeeId, password, confirmPassword } = req.body;

  try {
    const userEmployeeId = await User.findOne({
      attributes: ['userEmployeeId'],
      where: {
        userEmployeeId: employeeId,
      },
    });

    if (!userEmployeeId) {
      return res
        .status(401)
        .json({ success: false, message: 'Not Registered With Us' });
    }

    const validPassword = await isValidPassword(confirmPassword);

    if (!validPassword) {
      return res.status(404).json({
        message: 'Password is not meeting requirements',
      });
    }
    if (confirmPassword != password) {
      return res.status(404).json({
        message: 'Passwords Do Not Match!!',
      });
    }

    const hashedPassword = await hashPassword(confirmPassword);

    await User.update(
      {
        userPassword: hashedPassword,
      },
      {
        where: {
          userEmployeeId: employeeId,
        },
      }
    );

    res.status(201).json({ message: 'Password Created Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
    throw error;
  }
};

//Send OTP
const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = await prepareOtp();
    const userEmail = await User.findOne({
      attributes: ['userEmail'],
      where: {
        userEmail: email,
      },
    });

    if (!userEmail) {
      return res.status(401).json({ message: 'You Are An Unauthorized User' });
    }

    userOTPMap.set(email, otp);
    const htmlBody = await getHtmlContent('otp', { otp: otp });
    const subject = 'OTP - Verification FMS-TEST';
    await sendMail(email, subject, htmlBody);
    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    res.status(400).json({ message: 'OTP sending failed.' });
    throw error;
  }
};

//Verify Otp
const verifyOtp = async (req, res) => {
  const { email } = req.params;
  const { otp } = req.body;
  const storedOtp = userOTPMap.get(email);

  try {
    if (storedOtp === otp) {
      res.status(200).json({
        status: 'sucess',
        message: 'Password has been reset successfully.',
      });
    } else {
      res.status(400).json({
        status: 'failed',
        message: 'Wrong OTP!!!!',
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: 'Failed To verify',
    });
  }
};

//Get current user
const getCurrentUser = async (req, res) => {
  try {
    const rolesToCheck = ['user'];
    let currentUser;

    let token;

    if (req.cookies.access_token) token = req.cookies.access_token;

    if (!token) {
      return res.status(404).json({ message: 'User Not LoggedIn' });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    if (decoded.role === 'admin') {
      currentUser = await User.findOne({
        where: {
          userId: decoded.id,
        },
        attributes: [
          'userId',
          'userEmployeeId',
          'userEmail',
          'userRole',
          'userStatus',
        ],
      });
    } else {
      currentUser = await User.findOne({
        where: {
          userId: decoded.id,
          userRole: rolesToCheck,
        },
        attributes: [
          'userId',
          'userEmployeeId',
          'userEmail',
          'userRole',
          'userStatus',
        ],
      });
    }

    const permissions = await getPermissionsForUser(currentUser.userId);

    if (currentUser) {
      res.status(200).json({
        currentUser,
        permissions,
      });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching user.', error: error.message });
  }
};

//Get Refresh Token
const getRefreshToken = async (req, res) => {
  try {
    console.log('Cookies:', req.cookies);
    const { refresh_token } = req.cookies;
    let decoded;

    if (!refresh_token) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    // Decode the refresh token to extract userId
    decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);

    console.log('Decoded:', decoded);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Fetch user by userId and ensure they have a valid refresh token
    const user = await User.findOne({
      where: {
        userId: decoded.id,
        refreshToken: { [Op.not]: null },
      },
    });

    if (!user) {
      return res.status(403).json({ message: 'Unauthorized refresh token' });
    }

    console.log('User:', user);

    const permissions = await getPermissionsForUser(user.userId);

    // Decrypt the refresh token stored in the database
    const decryptedRefreshToken = await decryptToken(
      user.refreshToken,
      user.refreshTokenIv
    );

    // Compare the provided token with the decrypted token
    if (refresh_token !== decryptedRefreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate a new access token
    const { accessToken } = await generateTokens(
      user.userId,
      user.userRole,
      permissions
    );

    // Send the new access token in a secure HTTP-only cookie
    return res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        maxAge: 3600000, // 1 hour expiration
      })
      .status(200)
      .json({ message: 'Access token refreshed' });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

//Logout
const logoutUser = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      return res.status(400).json({ message: 'No active session to log out' });
    }

    // Decode the refresh token to extract userId
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Find the user and remove or nullify their refresh token
    const user = await User.findOne({ where: { userId: decoded.id } });

    if (user) {
      await User.update(
        { refreshToken: null, refreshTokenIv: null },
        { where: { userId: decoded.id } }
      );
    }

    // Clear cookies to log out the user
    res.clearCookie('access_token', { httpOnly: true });
    res.clearCookie('refresh_token', { httpOnly: true });

    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export {
  registerUser,
  getUserByEmployeeId,
  getAllUsers,
  deleteUserByEmployeeId,
  createPassword,
  addUserWithEmployeeId,
  loginUser,
  logoutUser,
  sendOtp,
  verifyOtp,
  getCurrentUser,
  getRefreshToken,
};
