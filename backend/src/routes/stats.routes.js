const express = require('express');
const {
  getStatsController,
  updateConfigController,
  resetStatsController,
  getHealthController,
} = require('../controllers/stats.controller');

const router = express.Router();

router.get('/stats', getStatsController);
router.get('/health', getHealthController);
router.post('/config', updateConfigController);
router.post('/reset', resetStatsController);

module.exports = router;
