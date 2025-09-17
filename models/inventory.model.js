const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Supplier = require('./supplier.model'); // We need to know about Suppliers

const Inventory = sequelize.define('Inventory', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Each SKU must be unique
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0 // If not specified, starts at 0
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2), // Can store numbers like 12345678.99
    allowNull: false
  },
  cost_price: { // This is how much it COST US to buy
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  reorder_threshold: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

// ⭐ Here is the magic that connects them! ⭐
// This says: "An Inventory item has one Supplier."
// It will automatically create a `supplierId` column in our Inventory table.
Inventory.belongsTo(Supplier, {
  foreignKey: 'supplier_id',
  as: 'supplier'
});

module.exports = Inventory;