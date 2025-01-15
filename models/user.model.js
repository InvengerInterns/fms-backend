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
      type: DataTypes.STRING(100),
      unique: true,
    },
    userPassword: {
      type: DataTypes.STRING(64),
    },
    userRole: {
      type: DataTypes.ENUM('super-admin', 'admin', 'user'),
      defaultValue: 'user',
    },
    userEmployeeId: {
      type: DataTypes.INTEGER,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refreshTokenIv: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    userStatus: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  { timeStamp: true }
);

User.sync({ alter: false });

export default User;
