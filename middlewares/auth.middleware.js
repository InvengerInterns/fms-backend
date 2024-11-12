import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { promisify } from 'util';
import crypto from 'crypto';
import User from '../models/user.model.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//JWT Signing
const signToken = async (id, role, permission) => {
  const token = await jwt.sign(
    { id, role, permission },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFESPAN,
    }
  );
  return token;
};

//JWT Verifying Token
const protect = async (req, res, next) => {
  try {
    const rolesToCheck = ['user'];

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
        attributes: ['userId', 'userEmail', 'userRole', 'userStatus'],
      });
    } else {
      currentUser = await User.findOne({
        where: {
          userId: decoded.id,
          userRole: rolesToCheck,
        },
        attributes: ['userId', 'userEmail', 'userRole', 'userStatus'],
      });
    }

    if (!currentUser) {
      return res
        .status(400)
        .json({ message: 'User Session Expired or No loner exists' });
    }

    req.user = currentUser;

    next();
  } catch (error) {
    return res.status(500).json({ message: `Error Occured: ${error.message}` });
  }
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

  try {
    return otp;
  } catch (error) {
    res.status(500).json({ message: `Error Occurred: ${error.message}` });
  }
};

//Role Based Access Middleware
const allowedTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.userRole)) {
      return res
        .status(401)
        .json({ message: 'This User is forbidden to use these services' });
    }

    next();
  };

//Email Body Matching
const getHtmlContent = async (type, options = {}) => {
  try {
    let filePath;
    let htmlContent;

    // Determine the HTML template file based on the email type
    if (type.toLowerCase() === 'otp' && options.otp) {
      filePath = path.join(__dirname, '../public/otp_body.html');
      htmlContent = await fs.readFile(filePath, 'utf-8');
      htmlContent = htmlContent.replace('{{OTP}}', options.otp);
    } else if (
      type.toLowerCase() === 'new-password' &&
      options.username &&
      options.link
    ) {
      filePath = path.join(__dirname, '../public/new_password.html');
      htmlContent = await fs.readFile(filePath, 'utf-8');
      htmlContent = htmlContent
        .replace('{{USERNAME}}', options.username)
        .replace('{{PASSWORD_CREATION_LINK}}', options.link);
    } else {
      throw new Error('Invalid parameters or missing template variables');
    }

    return htmlContent;
  } catch (error) {
    console.error('Error reading or processing file:', error);
    throw error;
  }
};

//Permission Based Access Middleware

export {
  hashPassword,
  isValidPassword,
  signToken,
  checkPassword,
  prepareOtp,
  protect,
  allowedTo,
  getHtmlContent,
};
