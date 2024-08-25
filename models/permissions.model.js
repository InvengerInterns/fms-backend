import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';

const Permissions = sequelize.define(
  'permissions',
  {
    permissionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    permissionName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Permissions.sync();
export default Permissions;
