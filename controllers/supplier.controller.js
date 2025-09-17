const Supplier = require('../models/supplier.model');

// Create, GetAll, GetByID, Update, Delete for Suppliers
exports.createSupplier = async (req, res) => {
  try {
    const newSupplier = await Supplier.create(req.body);
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (supplier) res.json(supplier);
    else res.status(404).json({ error: 'Supplier not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const [updated] = await Supplier.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedSupplier = await Supplier.findByPk(req.params.id);
      res.status(200).json(updatedSupplier);
    } else {
      res.status(404).json({ error: 'Supplier not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const deleted = await Supplier.destroy({ where: { id: req.params.id } });
    if (deleted) res.status(204).send();
    else res.status(404).json({ error: 'Supplier not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};