import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection.config.js';
const ClientDetails = sequelize.define('clientdetails',
    {
        clientId: {
        type : DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
        clientName : {
            type : DataTypes.String,
            allowNull:true
        },
    
    },
    {
        timestamps: true,
    }
    );

ClientDetails.sync();
export default ClientDetails;
