import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';

const JobPositions = sequelize.define(
  'job_position',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    jobPositionName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

JobPositions.sync({ alter: true });

export default JobPositions;
