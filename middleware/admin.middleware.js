function isAdmin(req, res, next) {
    // This middleware MUST run *after* the authenticateToken middleware,
    // because it depends on `req.user` being set.
    
    if (req.user && req.user.role === 'Admin') {
      next(); // The user is an admin, let them proceed.
    } else {
      res.status(403).json({ error: 'Forbidden: Access is restricted to administrators.' });
    }
  }
  
  module.exports = isAdmin;