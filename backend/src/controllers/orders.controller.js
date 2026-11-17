/**
 * Orders controller
 */

const { processOrdersWithRetry } = require('../services/orders.service');

async function getOrders(req, res, next) {
  const requestId = `req_ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const scenario = req.query.scenario;

  try {
    const result = await processOrdersWithRetry(requestId, scenario ? { scenario } : {});
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOrders,
};
