import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';

const DepartmentMaster = sequelize.define(
  'department_master',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    buisnessUnitId: { 
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    clientId: { 
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    managerId: { 
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    teamLeadId: { 
        type: DataTypes.INTEGER,
        allowNull: true,
    },
  },
  { timestamps: true }
);

DepartmentMaster.sync({ alter: true });

export default DepartmentMaster;