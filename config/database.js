// config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // This block is for PRODUCTION (on Render)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false, // Optional: Turn off noisy SQL logs in production
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // This block is for LOCAL development
  sequelize = new Sequelize('ronohs_decor_db', 'postgres', 'password', { // Replace 'password'
    host: 'localhost',
    dialect: 'postgres'
  });
}


module.exports = sequelize;