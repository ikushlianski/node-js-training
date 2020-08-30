import { Dialect, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

if (
  !process.env.DB_NAME ||
  !process.env.DB_USERNAME ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_HOSTNAME ||
  !process.env.DB_DIALECT
) {
  console.error('Invalid DB connection config');

  process.exit(1);
}

export const sequelizeConnection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOSTNAME,
    dialect: process.env.DB_DIALECT as Dialect,
  },
);
