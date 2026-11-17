/**
 * Stats, Configuration, and Health controller
 */

const { getStats, resetStats } = require('../services/stats.service');
const { updateConfig, getConfig } = require('../config/retryConfig');

function getStatsController(req, res) {
  const stats = getStats();
  res.status(200).json(stats);
}

function updateConfigController(req, res) {
  try {
    const updated = updateConfig(req.body);
    res.status(200).json({
      success: true,
      message: 'Retry configuration updated live',
      config: updated,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
}

function resetStatsController(req, res) {
  const resetResult = resetStats();
  res.status(200).json({
    success: true,
    message: 'Demo statistics and execution logs reset successfully',
    stats: resetResult,
  });
}

function getHealthController(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  });
}

module.exports = {
  getStatsController,
  updateConfigController,
  resetStatsController,
  getHealthController,
};
