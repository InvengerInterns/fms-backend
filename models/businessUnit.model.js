import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';

const BusinessUnit = sequelize.define(
  'business_unit',
  {
    businessId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    businessName: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

BusinessUnit.sync();

export default BusinessUnit;
