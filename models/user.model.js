import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';

const User = sequelize.define(
  'login_details',
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userEmail: {
      type: DataTypes.STRING(64),
      unique: true,
    },
    userPassword: {
      type: DataTypes.STRING(64),
    },
    userRole: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
    },
    userEmployeeId: {
      type: DataTypes.INTEGER,
    },
    userStatus: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  { timeStamp: true }
);

User.sync();

export default User;
