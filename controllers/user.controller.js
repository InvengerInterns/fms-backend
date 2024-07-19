import {
  checkPassword,
  prepareOtp,
  hashPassword,
  isValidPassword,
  signToken,
} from '../middlewares/auth.middleware.js';
import User from '../models/user.model.js';

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
        maxAge: 36000,
      })
      .status(200)
      .json({
        userAccess: user.userRole,
        message: 'User Logged In Successfully',
      });
  } catch (error) {
    return res.status(500).json({ message: `Server Error:${error.message}` });
  }
};

//Registering User
const registerUser = async (req, res) => {
  const { email, role, password, confirmPassword, employeeId } = req.params;

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
  const employeeId = req.params;
  try {
    const employeeData = await EmployeeDetails.findOne({
      where: {
        employeeId: employeeId,
      },
    });

    const newUser = await User.create({
      userEmail: employeeData.workEmail,
      userEmployeeId: employeeData.employeeId,
    });

    await newUser.save();

    res.status(201).json({ message: 'User Created' });
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
    userOTPMap.set(email, otp);
    console.log(userOTPMap);
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
  deleteUserByEmployeeId,
  createPassword,
  addUserWithEmployeeId,
  loginUser,
  logoutUser,
  sendOtp,
  verifyOtp,
};
