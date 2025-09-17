const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // We get our connection key

// Here we define the blueprint (the model) for our Clients table.
const Client = sequelize.define('Client', {
  // The 'name' column
  name: {
    type: DataTypes.STRING, // It's a string of text
    allowNull: false // It cannot be empty
  },
  // The 'contact' column
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // No two clients can have the same contact info
  },
  // The 'address' column
  address: {
    type: DataTypes.STRING,
    allowNull: true // This one can be empty
  },
  // The 'type' column
  type: {
    type: DataTypes.ENUM('Residential', 'Commercial'), // Can only be one of these two values
    allowNull: false
  }
});

module.exports = Client;