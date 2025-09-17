const sequelize = require('../config/database');
const { Op } = require('sequelize');
const Sale = require('../models/sale.model');
const Inventory = require('../models/inventory.model');
const Client = require('../models/client.model');

exports.getAdminDashboard = async (req, res) => {
    try {
        // 1. Calculate Total Revenue (CORRECTED)
        const totalRevenueResult = await Sale.findOne({
            attributes: [
                // This now correctly calculates money: price * quantity
                [sequelize.fn('SUM', sequelize.literal('price_at_sale * quantity')), 'totalRevenue']
            ],
            raw: true
        });
        const totalRevenue = parseFloat(totalRevenueResult.totalRevenue) || 0;

        // 2. Calculate Total Profit (This part was already correct)
        const salesWithCost = await Sale.findAll({
            include: [{ model: Inventory, attributes: ['cost_price'] }]
        });
        const totalProfit = salesWithCost.reduce((sum, sale) => {
            // Ensure values are numbers before calculation
            const cost = parseFloat(sale.Inventory?.cost_price || 0);
            const revenue = parseFloat(sale.price_at_sale);
            const quantity = parseInt(sale.quantity, 10);
            return sum + ((revenue - cost) * quantity);
        }, 0);

        // 3. Count Total Sales (Correct)
        const totalSales = await Sale.count();

        // 4. Count Total Clients (Correct)
        const totalClients = await Client.count();

        // 5. Find Top Selling Items (by quantity) (CORRECTED)
        const topSellingItems = await Sale.findAll({
            attributes: [
              'product_id',
              [sequelize.fn('SUM', sequelize.col('Sale.quantity')), 'totalQuantity']
            ],
            group: ['product_id', 'Inventory.id'],
            order: [[sequelize.fn('SUM', sequelize.col('Sale.quantity')), 'DESC']], // The corrected part
            limit: 5,
            include: [{
              model: Inventory,
              attributes: ['name']
            }]
          });

        // 6. Find Low Stock Items (Correct)
        const lowStockItems = await Inventory.findAll({
            where: {
                quantity: { [Op.lte]: sequelize.col('reorder_threshold') }
            }
        });

        // Assemble the dashboard object
        const dashboardData = {
            totalRevenue: totalRevenue.toFixed(2),
            totalProfit: totalProfit.toFixed(2),
            totalSales,
            totalClients,
            topSellingItems,
            lowStockItems
        };

        res.json(dashboardData);

    } catch (error) {
        console.error("Dashboard Error:", error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
};