import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';

const ClientDetails = sequelize.define(
  'clientdetails',
  {
    clientId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    clientName: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    clientDetailsStatus: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    businessId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: true,
  }
);

ClientDetails.sync();
export default ClientDetails;
