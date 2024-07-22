import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { promisify } from 'util';
import crypto from 'crypto';
import User from '../models/user.model.js';

dotenv.config();

//JWT Signing
const signToken = async (id, role) => {
  const token = await jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};

//JWT Verifying Token
const protect = async (req, res, next) => {
  const rolesToCheck = Object.values('user');
  let token;

  if (req.cookies.access_token) token = req.cookies.access_token;

  if (!token) {
    return res.status(404).json({ message: 'User Not LoggedIn' });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  let currentUser = null;

  if (decoded.role === 'admin') {
    currentUser = await User.findOne({
      where: {
        userId: decoded.id,
      },
    });
  } else {
    currentUser = await User.findOne({
      where: {
        userId: decoded.id,
        userRole: rolesToCheck,
      },
    });
  }

  if (!currentUser) {
    return res
      .status(400)
      .json({ message: 'User Session Expired or No loner exists' });
  }

  req.user = currentUser;

  next();
};

//Hashing Password
const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

//Password Validation
const isValidPassword = async (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return false;
  }
  if (!hasUpperCase) {
    return false;
  }
  if (!hasLowerCase) {
    return false;
  }
  if (!hasDigit) {
    return false;
  }
  if (!hasSpecialChar) {
    return false;
  }

  return true;
};

//Password Checking
const checkPassword = async (reqPassword, userPassword) => {
  try {
    const isMatch = await bcrypt.compare(reqPassword, userPassword);
    return isMatch;
  } catch (error) {
    throw new Error(`Password Verification Failed: ${error.message}`);
  }
};

//Generate OTP
const generateOtp = async () => {
  return crypto.randomBytes(3).toString('hex');
};

//Prepare OTP [add mail body here]
const prepareOtp = async () => {
  const otp = await generateOtp();
  console.log(otp);

  try {
    return otp;
  } catch (error) {
    res.status(500).json({ message: `Error Occurred: ${error.message}` });
  }
};

export {
  hashPassword,
  isValidPassword,
  signToken,
  checkPassword,
  prepareOtp,
  protect,
};
