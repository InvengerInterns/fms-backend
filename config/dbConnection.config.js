import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  // Connect to the database server without specifying a database
  const sequelizeWithoutDb = new Sequelize(
    process.env.DB_DIALECT === 'postgres' ? 'postgres' : '', // Default DB for PostgreSQL
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      logging: false,
      dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? {
          require: true,
          rejectUnauthorized: false, // Optional
        } : undefined,
      },
    }
  );

  try {
    if (process.env.DB_DIALECT === 'postgres') {
      // Check and create database for PostgreSQL
      const [results] = await sequelizeWithoutDb.query(
        `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}';`
      );

      if (results.length === 0) {
        await sequelizeWithoutDb.query(`CREATE DATABASE "${process.env.DB_NAME}";`);
        console.log(`Database ${process.env.DB_NAME} created.`);
      } else {
        console.log(`Database ${process.env.DB_NAME} already exists.`);
      }
    } else if (process.env.DB_DIALECT === 'mysql') {
      // Check and create database for MySQL
      await sequelizeWithoutDb.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
      console.log(`Database ${process.env.DB_NAME} ensured to exist.`);
    } else if (process.env.DB_DIALECT === 'mssql') {
      // Check and create database for MSSQL
      const [results] = await sequelizeWithoutDb.query(
        `SELECT name FROM sys.databases WHERE name = N'${process.env.DB_NAME}';`
      );

      if (results.length === 0) {
        await sequelizeWithoutDb.query(`CREATE DATABASE [${process.env.DB_NAME}];`);
        console.log(`Database ${process.env.DB_NAME} created.`);
      } else {
        console.log(`Database ${process.env.DB_NAME} already exists.`);
      }
    } else {
      throw new Error(`Unsupported DB_DIALECT: ${process.env.DB_DIALECT}`);
    }

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
      max: 1000,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false,
      } : undefined,
    },
    timezone: '+05:30',
  }
);

export default sequelize;
