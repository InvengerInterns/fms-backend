import {
  checkPassword,
  prepareOtp,
  hashPassword,
  isValidPassword,
  signToken,
  getHtmlContent,
} from '../middlewares/auth.middleware.js';
import User from '../models/user.model.js';
import Employee from '../models/Employee.model.js';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import sendMail from '../utils/emailSend.util.js';
import dotenv from 'dotenv';
import PermissionsMaster from '../models/permissionsMaster.model.js';
import { accessControls, permission_Ids } from '../constants.js';

dotenv.config();

const userOTPMap = new Map();

//Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        userEmail: email,
        userStatus: 1,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User Doesnot Exists!!! Please Register' });
    }

    if (!user.userEmail) {
      return res
        .status(404)
        .json({ message: 'Username or Password is Inavalid' });
    }

    const isMathing = await checkPassword(password, user.userPassword);
    if (!isMathing) {
      return res
        .status(404)
        .json({ message: 'Username or Password is Inavalid' });
    }

    const token = await signToken(user.userId, user.userRole);

    return res
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge: 3600000,
      })
      .status(200)
      .json({
        userAccess: user.userRole,
        message: 'User Logged In Successfully',
        access_token: token,
      });
  } catch (error) {
    return res.status(500).json({ message: `Server Error:${error.message}` });
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

    if (!employeeData) {
      return res.status(404).json({
        message: 'Employee Not Found',
      });
    }

    const newUser = await User.create({
      userEmail: employeeData.workEmail,
      userEmployeeId: employeeData.employeeId,
    });

    await newUser.save();

    const newUserData = await User.findOne({
      order: [['userId', 'DESC']],
    });

    const permissionsWithStatus = {
      [permission_Ids.ABOUT]: accessControls.WRITE,
      [permission_Ids.INTERVIEWS]: accessControls.WRITE,
      [permission_Ids.SALARY_SLIP]: accessControls.NO_ACCESS,
      [permission_Ids.OFFER_CONFIRMATION]: accessControls.NO_ACCESS,
      [permission_Ids.OFFER_LETTER]: accessControls.NO_ACCESS,
      [permission_Ids.ONBOARDING]: accessControls.NO_ACCESS,
      [permission_Ids.BACKGROUND_VERIFICATION]: accessControls.WRITE,
      [permission_Ids.PERFORMANCE_APPRAISAL]: accessControls.NO_ACCESS,
      [permission_Ids.CERTIFICATION]: accessControls.READ,
      [permission_Ids.HR_SCREENING]: accessControls.READ,
      [permission_Ids.EXIT_FORMALITIES]: accessControls.NO_ACCESS,
      [permission_Ids.CLIENT_HISTORY]: accessControls.READ,
    };

    const newUserPermissions = await Promise.all(
      Object.entries(permissionsWithStatus).map(
        async ([permissionId, status]) => {
          return await PermissionsMaster.create({
            userId: newUserData.userId,
            permissionId: parseInt(permissionId),
            status: status,
          });
        }
      )
    );

    //link = `http://localhost:5000/api/v1/user/password-update/${employeeData.employeeId}`;
    link = `http://localhost:5000/api/v1/user/password-update`;
    const htmlBody = await getHtmlContent('new-password', {
      username: employeeData.firstName,
      link: link,
    });
    const subject = 'User Password Creation FMS-TEST';
    await sendMail(employeeData.workEmail, subject, htmlBody);

    res.status(201).json({
      message: 'User Created and Email for password creation has been Sent',
      permissions: newUserPermissions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
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

    return res.status(200).json({
      data: {
        email: existingUserById.userEmail,
        role: existingUserById.userRole,
        userPassword: hashedPassword,
        employeeNumber: existingUserById.employeeId,
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
    const subject = 'OTP- Verification FMS-TEST';
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
        attributes: ['userEmployeeId', 'userEmail', 'userRole', 'userStatus'],
      });
    } else {
      currentUser = await User.findOne({
        where: {
          userId: decoded.id,
          userRole: rolesToCheck,
        },
        attributes: ['userEmployeeId', 'userEmail', 'userRole', 'userStatus'],
      });
    }

    if (currentUser) {
      res.status(200).json({
        currentUser,
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

//Logout
const logoutUser = async (req, res) => {
  try {
    res.cookie('access_token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(500).json({ message: `Server Error ${error.message}` });
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
};
