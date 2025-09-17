const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Supplier = sequelize.define('Supplier', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lead_time_days: {
    type: DataTypes.INTEGER,
    allowNull: true // Can be empty if not known
  }
});

module.exports = Supplier;