/**
 * Products controller
 */

const { getProductsWithRetry } = require('../services/products.service');

async function getProducts(req, res, next) {
  const requestId = `req_prd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const scenario = req.query.scenario;

  try {
    const result = await getProductsWithRetry(requestId, scenario ? { scenario } : {});
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
};
