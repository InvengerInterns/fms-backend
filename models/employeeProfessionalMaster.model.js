import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';

const EmployeeProfessionalDetailsMaster = sequelize.define(
  'employee_professional_details_master',
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
    workEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    }, 
    jobPositionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    reportingManagerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    teamLeadId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    businessUnitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    resumelink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

EmployeeProfessionalDetailsMaster.sync({ alter: false });
//Department ID should be auto picked using job position ID

export default EmployeeProfessionalDetailsMaster;