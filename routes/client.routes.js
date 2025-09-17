const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller'); // Import our manager
const authenticateToken = require('../middleware/auth.middleware');

// Route 1: When a POST request comes to /clients, use the createClient function.
router.post('/', authenticateToken, clientController.createClient);

// Route 2: When a GET request comes to /clients, use the getAllClients function.
router.get('/', authenticateToken, clientController.getAllClients);

// Route 3: Get a single client by ID. The :id part is a variable.
router.get('/:id', authenticateToken, clientController.getClientById);

// Route 4: Update a client. We use PUT for updates.
router.put('/:id', authenticateToken, clientController.updateClient);

// Route 5: Delete a client.
router.delete('/:id', authenticateToken, clientController.deleteClient);

module.exports = router;