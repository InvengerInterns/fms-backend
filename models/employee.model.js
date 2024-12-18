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
    workEmail: {
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
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employeeImage: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
      allowNull: true,
    },
    passportphotoLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    normalphotoLink: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
      allowNull: true,
    },
    resumelink: {
      type: DataTypes.STRING,
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
