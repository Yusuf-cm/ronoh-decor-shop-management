const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const dashboardRoutes = require('./routes/dashboard.routes');

require('./models/client.model'); 
require('./models/supplier.model');
require('./models/inventory.model');
require('./models/sale.model');
require('./models/project.model');
require('./models/user.model');

// 1. Import the client routes file
const clientRoutes = require('./routes/client.routes');
const supplierRoutes = require('./routes/supplier.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const saleRoutes = require('./routes/sale.routes');
const projectRoutes = require('./routes/project.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to Ronohs Decor Shop API!');
});

// 2. Tell the app: for any URL that starts with "/api/clients", 
// use the rules defined in clientRoutes.
app.use('/api/clients', clientRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced successfully!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
});