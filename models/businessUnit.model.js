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
    buisnessUnitStatus: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
  }
);

BusinessUnit.sync({ alter: true });

export default BusinessUnit;
