const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authenticateToken = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/admin.middleware');

// This route is protected by two guards.
// The request must pass authenticateToken first, then isAdmin.
router.get('/summary', [authenticateToken, isAdmin], dashboardController.getAdminDashboard);

module.exports = router;