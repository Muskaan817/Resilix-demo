/**
 * Users controller
 */

const { getUsersWithRetry } = require('../services/users.service');

async function getUsers(req, res, next) {
  const requestId = `req_usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const scenario = req.query.scenario;

  try {
    const result = await getUsersWithRetry(requestId, scenario ? { scenario } : {});
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
};
