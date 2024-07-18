import app from './app.js';
import dotenv from 'dotenv';
import sequelize from './config/dbConnection.config.js';

dotenv.config();
const port = process.env.PORT;

try {
  await sequelize.authenticate();
  app.listen(port, console.log(`[SERVER]: Running Server On Port ${port}`));
  console.log('[Database]: Connection has been established successfully.');
} catch (error) {
  console.error('Internal Server Error', error.message);
}
