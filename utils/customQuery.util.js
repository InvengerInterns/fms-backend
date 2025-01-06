import sequelize from '../config/dbConnection.config.js';
import ClientDetails from '../models/clientDetails.model.js';

const getCustomQueryResults = async (
  tables,
  joins,
  attributes,
  whereCondition
) => {
  try {
    // Constructing the base query
    let query;

    if (attributes && attributes.length > 0) {
      query = `SELECT ${attributes.join(', ')} FROM ${tables[0]}`;
    } else {
      query = `SELECT * FROM ${tables[0]}`;
    }

    // Add JOIN conditions dynamically
    for (let i = 1; i < tables.length; i++) {
      const joinType = joins[i - 1].joinType; // e.g., 'INNER', 'LEFT'
      const onCondition = joins[i - 1].onCondition; // e.g., 'Users.userId = Permissions.permissionId'

      query += ` ${joinType} JOIN ${tables[i]} ON ${onCondition}`;
    }

    // Add WHERE condition if exists
    if (whereCondition) {
      query += ` WHERE ${whereCondition}`;
    }

    // Run the raw query and get the result
    const [results, metadata] = await sequelize.query(query);

    return results; // Returning the query results
  } catch (error) {
    console.error('Error executing custom query:', error);
    throw error;
  }
};

const checkClientData = async (clientId,businessId) => {
  try {
    console.log('clientId',clientId);
    console.log('businessId',businessId);
    const clientData = await ClientDetails.findOne({where: {clientId}});
    if (!clientData) {    
      throw new Error('Client not found');
    }
    if (clientData.businessId !== parseInt(businessId)) {
      throw new Error('Client not found for the given business ID');
    }else {
      return clientData;
    }
  }
  catch(error){
    throw error;
  }
}

export { getCustomQueryResults,checkClientData };
