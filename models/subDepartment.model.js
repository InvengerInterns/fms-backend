import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';

const SubDepartment = sequelize.define(
  'sub_department',
  {
    subDepartmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subDepartmentName: {
      type: DataTypes.STRING(64),
    },
    departmentId: {
      type: DataTypes.INTEGER,
    },
    teamLeadId: {
      type: DataTypes.INTEGER,
    },
    subDepartmentStatus: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
  }
);

SubDepartment.sync({ alter: true });;

export default SubDepartment;
