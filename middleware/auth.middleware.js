const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-super-secret-key-that-is-long-and-random'; // Must be the same secret key!

function authenticateToken(req, res, next) {
  // The ID card is usually sent in the "Authorization" header like this: "Bearer TOKEN"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // 401 Unauthorized - they didn't provide a card
  }

  // Ask our jwt tool to verify the card
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // 403 Forbidden - the card is fake or expired
    }

    // If the card is real, attach the user's info to the request object
    req.user = user;
    next(); // Let them proceed to the endpoint they were trying to reach
  });
}

module.exports = authenticateToken;