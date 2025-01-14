import sequelize from '../config/dbConnection.config.js';
import ClientDetails from '../models/clientDetails.model.js';

const quoteIdentifier = (identifier) => {
  const dialect = sequelize.options.dialect;

  if (dialect === 'mysql' || dialect === 'mariadb') {
    return `\`${identifier}\``;  // MySQL and MariaDB use backticks
  }
  if (dialect === 'postgres') {
    return `"${identifier}"`;  // PostgreSQL uses double quotes
  }
  if (dialect === 'mssql') {
    return `[${identifier}]`;  // MSSQL uses square brackets
  }

  return identifier;  // Default case
};

// Main function to execute custom query
const getCustomQueryResults = async (
  tables,
  joins,
  attributes,
  whereCondition,
  replacements = {}
) => {
  try {
    let query = '';

    if (!tables || tables.length === 0) {
      throw new Error('Tables are required for the query');
    }

    if (tables.length > 1 && (!joins || joins.length === 0)) {
      throw new Error('Join conditions are required for multiple tables');
    }

    if (whereCondition && typeof whereCondition !== 'string') {
      throw new Error('WHERE condition must be a string');
    }

    // Quote attributes
    const quotedAttributes = attributes?.map((attr) => {
      const parts = attr.split(' AS ');
      if (parts.length === 2) {
        const column = parts[0].includes('.')
          ? parts[0]
              .split('.')
              .map((part) => quoteIdentifier(part))
              .join('.')
          : quoteIdentifier(parts[0]);
        const alias = quoteIdentifier(parts[1]);
        return `${column} AS ${alias}`;
      }

      return attr.includes('.')
        ? attr
            .split('.')
            .map((part) => quoteIdentifier(part))
            .join('.')
        : quoteIdentifier(attr);
    });

    if (quotedAttributes) {
      query += `SELECT ${quotedAttributes.join(', ')} FROM ${quoteIdentifier(tables[0])}`;
    } else {
      query += `SELECT * FROM ${quoteIdentifier(tables[0])}`;
    }

    // Add JOINs
    for (let i = 1; i < tables.length; i++) {
      const joinType = joins[i - 1]?.joinType || 'INNER'; // Default to INNER JOIN
      const onCondition = joins[i - 1]?.onCondition;

      if (!onCondition) {
        throw new Error(`Join condition missing for table: ${tables[i]}`);
      }

      const quotedCondition = onCondition
        .split(' ')
        .map((word) =>
          word.includes('.') ? word.split('.').map(quoteIdentifier).join('.') : word
        )
        .join(' ');

      query += ` ${joinType} JOIN ${quoteIdentifier(tables[i])} ON ${quotedCondition}`;
    }

    // Add WHERE condition if it exists
    if (whereCondition) {
      const quotedWhereCondition = whereCondition
        .split(' ')
        .map((word) =>
          word.includes('.') ? word.split('.').map(quoteIdentifier).join('.') : word
        )
        .join(' ');

      query += ` WHERE ${quotedWhereCondition}`;
    }

    // Execute query with replacements
    const results = await sequelize.query(query, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    return results;
  } catch (error) {
    console.error('Error executing custom query:', error);
    throw error;
  }
};

const checkClientData = async (clientId, businessId) => {
  try {
    console.log('clientId', clientId);
    console.log('businessId', businessId);
    const clientData = await ClientDetails.findOne({ where: { clientId } });
    if (!clientData) {
      throw new Error('Client not found');
    }
    if (clientData.businessId !== parseInt(businessId)) {
      throw new Error('Client not found for the given business ID');
    } else {
      return clientData;
    }
  } catch (error) {
    throw error;
  }
};

export { getCustomQueryResults, checkClientData };
