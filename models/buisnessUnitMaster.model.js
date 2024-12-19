import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';

const BusinessUnitMaster = sequelize.define(
  'business_unit_master',
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
    businessUnitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Active','Relieved','Active-Idle'),
        allowNull: true,
        defaultValue: 'Active',
    }
  },
  {
    timestamps: true,
  }
);

BusinessUnitMaster.sync({ alter: false });

export default BusinessUnitMaster;