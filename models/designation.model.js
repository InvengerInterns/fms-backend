import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';

const Designation = sequelize.define(
  'designation',
  {
    designationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    designationName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    designationStatus: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
  }
);

Designation.sync();
export default Designation;
