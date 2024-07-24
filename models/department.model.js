import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';

const Department = sequelize.define(
  'department',
  {
    departmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    departmentName: {
      type: DataTypes.STRING(128),
    },
    buisnessId: {
      type: DataTypes.INTEGER,
    },
    managerId: {
      type: DataTypes.INTEGER,
    },
    buisnessStatus: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
  }
);

Department.sync();

export default Department;
