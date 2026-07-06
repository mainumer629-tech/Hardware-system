const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'mysql';
const isSqlite = dialect === 'sqlite';

const sequelize = new Sequelize(
  isSqlite ? {
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || './backend/data/garment_pos.sqlite',
    logging: false
  } : {
    database: process.env.DB_NAME || 'garment_pos',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: dialect,
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = { sequelize };
