const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Client = require('./client.model');
const Inventory = require('./inventory.model');

const Sale = sequelize.define('Sale', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price_at_sale: { // We store the price in case the item's unit_price changes later
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_type: {
    type: DataTypes.ENUM('Cash', 'Mobile Money', 'Credit'),
    allowNull: false
  },
  sale_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW // Sets the sale date to the current time by default
  }
});

// A Sale belongs to one Client
Sale.belongsTo(Client, { foreignKey: 'client_id' });

// A Sale is for one Inventory item
Sale.belongsTo(Inventory, { foreignKey: 'product_id' });

module.exports = Sale;