const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// A secret key for our ID cards. In a real app, this MUST be hidden!
const JWT_SECRET = 'your-super-secret-key-that-is-long-and-random';

// Register a new user
exports.register = async (req, res) => {
  try {
    // The password will be automatically hashed by the model's hook
    const user = await User.create(req.body);
    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login an existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by their email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' }); // Unauthorized
    }

    // 2. Compare the provided password with the scrambled one in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. If they match, create the ID card (JWT)
    const payload = {
      id: user.id,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' }); // Card is valid for 1 day

    // 4. Send the ID card to the user
    res.json({ message: 'Logged in successfully', token: token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};