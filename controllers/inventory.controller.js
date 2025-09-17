const Inventory = require('../models/inventory.model');
const Supplier = require('../models/supplier.model'); // We need this to include supplier info

exports.createItem = async (req, res) => {
  try {
    const newItem = await Inventory.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Inventory.findAll({
      include: [{ // This is how we join the tables!
        model: Supplier,
        as: 'supplier' // This 'as' must match the one in the model definition
      }]
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await Inventory.findByPk(req.params.id, {
            include: [{
                model: Supplier,
                as: 'supplier'
            }]
        });
        if (item) res.json(item);
        else res.status(404).json({ error: 'Item not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const [updated] = await Inventory.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedItem = await Inventory.findByPk(req.params.id);
            res.status(200).json(updatedItem);
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const deleted = await Inventory.destroy({ where: { id: req.params.id } });
        if (deleted) res.status(204).send();
        else res.status(404).json({ error: 'Item not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};