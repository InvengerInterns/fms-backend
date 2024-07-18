import {
  hashPassword,
  isValidPassword,
} from '../middlewares/auth.middleware.js';
import User from '../models/user.model.js';

//Registering User
const registerUser = async (req, res) => {
  const { email, password, confirmPassword, role, employeeId } = req.body;

  try {
    if (confirmPassword != password) {
      return res.status(404).json({
        message: 'Passwords Do Not Match!!',
      });
    }

    if (!email.endsWith('@invenger.com')) {
      return res.status(404).json({
        message: 'Usage of Work Email is preffered',
      });
    }

    const validPassword = await isValidPassword(confirmPassword);

    if (!validPassword) {
      return res.status(404).json({
        message: 'Password is not meeting requirements',
      });
    }

    const existingUser = await User.findAll({
      where: {
        userEmail: email,
      },
    });

    console.log(existingUser);

    if (!existingUser) {
      return res.status(400).json({
        message: 'User Already Exists!!',
      });
    }

    const hashedPassword = await hashPassword(confirmPassword);

    const newUser = await User.create({
      userEmail: email,
      userPassword: hashedPassword,
      userRole: role,
      employeeId: employeeId,
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

export { registerUser };
