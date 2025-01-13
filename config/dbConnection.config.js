import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  // Connect to MySQL without specifying a database
  const sequelizeWithoutDb = new Sequelize(
    '', // No database specified
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: false,
    }
  );

  try {
    // Check if the database exists, if not, create it
    await sequelizeWithoutDb.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    );
    console.log(`Database ${process.env.DB_NAME} ensured to exist.`);

    // Close the connection without database
    await sequelizeWithoutDb.close();
  } catch (error) {
    console.error('Error ensuring database existence:', error);
    process.exit(1);
  }
}

await initializeDatabase(); // Ensure database exists

// Now connect to the specified database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    pool: {
      max: 1000, // Maximum number of connection in pool
      min: 0, // Minimum number of connection in pool
      acquire: 30000, // Maximum time, in milliseconds, that a connection can be idle before being released
      idle: 10000, // Maximum time, in milliseconds, that pool will try to get connection before throwing error
    },
    timezone: '+05:30', // Use the local time of the host
  }
);

export default sequelize;
