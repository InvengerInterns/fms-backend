import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';

const Employee = sequelize.define(
  'employee',
  {
    employeeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateofBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    personalEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tshirtSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    permanentAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currentAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: false,
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
      type: DataTypes.INTEGER,
      allowNull: true,
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
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },
  },
  {
    timestamps: true,
  }
);

Employee.sync();
export default Employee;
