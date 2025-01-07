import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { promisify } from 'util';
import User from '../models/user.model.js';
import { getPermissionsForUser } from '../utils/user.util.js';

dotenv.config();

// JWT Verifying Token with Expiry Check
const protect = async (req, res, next) => {
  try {
    const rolesToCheck = ['user'];

    let token;

    if (req.cookies.access_token) token = req.cookies.access_token;

    if (!token) {
      return res.status(404).json({ message: 'User Not LoggedIn' });
    }

    // Decode the token without verifying to check the expiration first
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid Token' });
    }

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decoded.payload.exp < currentTime) {
      return res.status(401).json({
        message: 'Token Expired. Please Login Again.',
        statusCode: 'TokenExpired',
      });
    }

    // Verify the token
    const verifiedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    let currentUser = null;

    if (verifiedToken.role === 'admin') {
      currentUser = await User.findOne({
        where: {
          userId: verifiedToken.id,
        },
        attributes: ['userId', 'userEmail', 'userRole', 'userStatus'],
      });
    } else {
      currentUser = await User.findOne({
        where: {
          userId: verifiedToken.id,
          userRole: rolesToCheck,
        },
        attributes: ['userId', 'userEmail', 'userRole', 'userStatus'],
      });
    }

    if (!currentUser) {
      return res
        .status(400)
        .json({ message: 'User Session Expired or No longer exists' });
    }

    req.user = currentUser;

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error Occurred: ${error.message}` });
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

//Permission Based Access Middleware
const permittedTo = (permissions) => async (req, res, next) => {
  try {
    const user = req.user;
    const { permission, action } = permissions;

    if (user.userRole === 'super-admin') {
      return next();
    }

    const userPermissions = await getPermissionsForUser(user.userId);

    const hasPermission = action.some((act) =>
      userPermissions.some(
        (perm) => perm.permissionId === permission && perm.status === act
      )
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { protect, allowedTo, permittedTo };
