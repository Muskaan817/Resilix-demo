/**
 * Express application configuration
 */

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

// Routes - supports both direct endpoints (/users) and prefixed (/api/users)
app.use('/users', usersRoutes);
app.use('/api/users', usersRoutes);

app.use('/products', productsRoutes);
app.use('/api/products', productsRoutes);

app.use('/orders', ordersRoutes);
app.use('/api/orders', ordersRoutes);

app.use('/', statsRoutes);
app.use('/api', statsRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
