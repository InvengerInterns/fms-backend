import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

//JWT Signing
const signToken = async (id, role) => {
  const token = await jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};

//JWT Verifying Token
const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json({ message: 'Unauthorized User' });

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error)
      return res
        .status(403)
        .json({ message: `Forbidden User ${error.message}` });

    req.user = user;
    next();
  });
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
  verifyToken,
  checkPassword,
  prepareOtp,
};
