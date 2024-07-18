import {
  hashPassword,
  isValidPassword,
} from '../middlewares/auth.middleware.js';
import User from '../models/user.model.js';

//Registering User
const registerUser = async (req, res) => {
  const { email,role, employeeId } = req.body;

  try {
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

    //const hashedPassword = await hashPassword(confirmPassword);

    const newUser = await User.create({
      userEmail: email,
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
        employeeId: employeeId,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: 'User with this Employee ID does not exist!!',
      });
    }

    await User.destroy({
      where: {
        employeeId: employeeId,
      },
    });

    return res.status(200).json({
      message: 'User deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
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

    res.status(201).json({message:'Password Created Successfully'});
  } catch (error) {
    res.status(500).json({message:'Internal Server Error'});
    throw error;
  }
};

export {
  registerUser,
  getUserByEmployeeId,
  deleteUserByEmployeeId,
  createPassword,
};
