import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';

const Employee = sequelize.define(
  'employee',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female'),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateofBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    personalEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tshirtSize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    permanentAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    currentAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employeeImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    employeeImageLowResolution: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    passport: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aadhar: {
      type: DataTypes.STRING(12), // Limit the length to 12 characters
      allowNull: true,
      validate: {
        isNumeric: true, // Ensure the string only contains numbers
        len: [12, 12], // Ensure exactly 12 characters
      },
    },
    pancard: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    passportphotoLink: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    normalphotoLink: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    joinDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    jobDescription: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 2,
    },
  },
  {
    timestamps: false,
  }
);

Employee.sync({ alter: true });
export default Employee;
