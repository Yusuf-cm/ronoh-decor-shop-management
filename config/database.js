// This file contains the "key" to our database.
const { Sequelize } = require('sequelize');

// Create a new Sequelize object with our database details.
// It's like telling it: "Here is the address, the username, and the password."
const sequelize = new Sequelize('ronohs_decor_db', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres' // Tell Sequelize we are using PostgreSQL
});

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