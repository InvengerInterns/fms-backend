import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';

const EmployeeDocument = sequelize.define(
  'employee_document',
  {
    employeeId: {
      type: DataTypes.INTEGER,
    },

    documentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    documentName: {
      type: DataTypes.STRING,
    },

    documentPath: {
      type: DataTypes.STRING,
    },

    documentStatus: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
  }
);

EmployeeDocument.sync();

export default EmployeeDocument;
