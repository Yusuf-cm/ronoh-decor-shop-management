const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs'); // Import the password scrambler

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true // Make sure it's a valid email format
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Shopkeeper', 'Shop Assistant'),
    allowNull: false
  }
});

// ⭐ The Magic Hook ⭐
// This function runs automatically right before a new user is created.
User.beforeCreate(async (user, options) => {
  const salt = await bcrypt.genSalt(10); // Create a "salt" to make the hash unique
  user.password = await bcrypt.hash(user.password, salt); // Scramble the password
});

module.exports = User;