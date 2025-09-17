const sequelize = require('../config/database'); // We need direct access to sequelize for transactions
const Sale = require('../models/sale.model');
const Inventory = require('../models/inventory.model');
const Client = require('../models/client.model');

// ACTION 1: Record a new Sale (The Transactional Part)
exports.createSale = async (req, res) => {
    const t = await sequelize.transaction();
  
    try {
      // ⭐ Get the custom price from the request, or leave it undefined
      const { client_id, product_id, quantity, payment_type, price_at_sale } = req.body;
  
      const product = await Inventory.findByPk(product_id, { transaction: t });
  
      if (!product) { throw new Error('Product not found!'); }
      if (product.quantity < quantity) { throw new Error('Not enough stock available!'); }
  
      const newQuantity = product.quantity - quantity;
      await Inventory.update(
        { quantity: newQuantity },
        { where: { id: product_id }, transaction: t }
      );
  
      // ⭐ Use the provided price_at_sale, OR if it's missing, use the product's default unit_price
      const finalSalePrice = price_at_sale !== undefined ? price_at_sale : product.unit_price;
  
      const sale = await Sale.create({
        client_id,
        product_id,
        quantity,
        price_at_sale: finalSalePrice, // Use our final calculated price
        payment_type
      }, { transaction: t });
  
      await t.commit();
      res.status(201).json(sale);
    } catch (error) {
      await t.rollback();
      res.status(400).json({ error: error.message });
    }
  };

// ACTION 2: Get all Sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      // Include details of the client and the product sold
      include: [
        { model: Client },
        { model: Inventory }
      ],
      order: [['sale_date', 'DESC']] // Show most recent sales first
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};