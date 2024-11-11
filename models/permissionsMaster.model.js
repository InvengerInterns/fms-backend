import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';

const PermissionsMaster = sequelize.define(
  'permissions_master',
  {
    masterId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    permissionId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

PermissionsMaster.sync({ alter: true });
export default PermissionsMaster;
