// This file contains the "key" to our database.
require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // This block is for PRODUCTION (on Render)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // This is important for Render connections
      }
    }
  });
} else {
  // This block is for LOCAL development
  sequelize = new Sequelize('ronohs_decor_db', 'postgres', 'admin', {
    host: 'localhost',
    dialect: 'postgres'
  });
}

// This is a little test to see if the key works.
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Run the test.
testConnection();

// Export the key so other parts of our app can use it.
module.exports = sequelize;