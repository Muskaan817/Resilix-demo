/**
 * Express application configuration
 */

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const usersRoutes = require('./routes/users.routes');
const productsRoutes = require('./routes/products.routes');
const ordersRoutes = require('./routes/orders.routes');
const statsRoutes = require('./routes/stats.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes - supports both direct endpoints (/users) and prefixed (/api/users)
app.use('/users', usersRoutes);
app.use('/api/users', usersRoutes);

app.use('/products', productsRoutes);
app.use('/api/products', productsRoutes);

app.use('/orders', ordersRoutes);
app.use('/api/orders', ordersRoutes);

app.use('/', statsRoutes);
app.use('/api', statsRoutes);

// Optional: Serve frontend production build statically if built
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    // Avoid capturing API routes
    if (
      req.path.startsWith('/users') ||
      req.path.startsWith('/products') ||
      req.path.startsWith('/orders') ||
      req.path.startsWith('/stats') ||
      req.path.startsWith('/health') ||
      req.path.startsWith('/config') ||
      req.path.startsWith('/reset') ||
      req.path.startsWith('/api')
    ) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

module.exports = app;
