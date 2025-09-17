const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Client = require('./client.model');

const Project = sequelize.define('Project', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., Kitchen Remodel, Full Home Decor'
  },
  site_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATEONLY, // Stores only the date, not time
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true // End date might not be known at the start
  },
  status: {
    type: DataTypes.ENUM('Planning', 'In Progress', 'Completed', 'On Hold'),
    defaultValue: 'Planning',
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT, // For longer descriptions or notes
    allowNull: true
  }
});

// A Project belongs to one Client
Project.belongsTo(Client, { foreignKey: 'client_id' });

module.exports = Project;