import { Sequelize } from 'sequelize';
import User from './User.js';

const config = {
  username: process.env.PROD_DB_USERNAME || 'tipping-bot',
  password: process.env.PROD_DB_PASSWORD || 'tipping-bot-postgresql',
  database: process.env.PROD_DB_NAME || 'tipping-bot-postgresql',
  host: process.env.PROD_DB_HOST || 'localhost',
  port: process.env.PROD_DB_PORT || 5432,
  dialect: 'postgres',
};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
const db = {
  User: User.init(sequelize),
  sequelize,
  Sequelize
};

export default db; 