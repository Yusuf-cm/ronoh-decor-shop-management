const Client = require('../models/client.model');

// ACTION 1: Create a new Client
exports.createClient = async (req, res) => {
  try {
    const newClient = await Client.create(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ACTION 2: Get all Clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ⭐ NEW ACTION 3: Get a single Client by their ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id); // findByPk means "Find by Primary Key"
    if (client) {
      res.json(client);
    } else {
      // If no client with that ID is found
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ⭐ NEW ACTION 4: Update a Client by their ID
exports.updateClient = async (req, res) => {
  try {
    const [updated] = await Client.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedClient = await Client.findByPk(req.params.id);
      res.status(200).json(updatedClient);
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ⭐ NEW ACTION 5: Delete a Client by their ID
exports.deleteClient = async (req, res) => {
  try {
    const deleted = await Client.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      // Send back a status that means "No Content", which is standard for a successful delete
      res.status(204).send(); 
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};