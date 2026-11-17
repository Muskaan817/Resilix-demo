/**
 * Telemetry and activity log service for Resilix Demo
 */

const { getConfig } = require('../config/retryConfig');

const stats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalRetries: 0,
  successfulRecoveries: 0,
  totalAttempts: 0,
  totalResponseTimeMs: 0,
};

let activityLogs = [];

/**
 * Appends a log entry to activity stream
 */
function addLog(entry) {
  const item = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  activityLogs.unshift(item);
  if (activityLogs.length > 100) {
    activityLogs = activityLogs.slice(0, 100);
  }
  return item;
}

function recordRequestStart(requestId, endpoint) {
  stats.totalRequests++;
  addLog({
    requestId,
    endpoint,
    status: 'STARTING',
    message: `[${endpoint}] Initiating operation with request ID ${requestId}`,
  });
}

function recordAttempt(requestId, endpoint, attempt) {
  stats.totalAttempts++;
  addLog({
    requestId,
    endpoint,
    attempt,
    status: 'ATTEMPTING',
    message: `[${endpoint}] Attempt #${attempt} executing...`,
  });
}

function recordRetry(requestId, endpoint, err, meta) {
  stats.totalRetries++;
  addLog({
    requestId,
    endpoint,
    attempt: meta.attempt,
    delay: meta.delay,
    status: 'RETRYING',
    message: `[${endpoint}] Transient error: "${err.message}". Retrying in ${meta.delay}ms (${meta.retriesLeft} retries remaining)...`,
  });
}

function recordSuccess(requestId, endpoint, attempts, responseTimeMs) {
  stats.successfulRequests++;
  stats.totalResponseTimeMs += responseTimeMs;
  const wasRecovered = attempts > 1;
  if (wasRecovered) {
    stats.successfulRecoveries++;
  }

  addLog({
    requestId,
    endpoint,
    attempt: attempts,
    responseTimeMs,
    status: wasRecovered ? 'RETRIED_SUCCESS' : 'SUCCESS',
    message: `[${endpoint}] Succeeded in ${responseTimeMs}ms after ${attempts} attempt(s)${wasRecovered ? ' (recovered via retry)' : ''}.`,
  });
}

function recordFailure(requestId, endpoint, attempts, error, responseTimeMs) {
  stats.failedRequests++;
  stats.totalResponseTimeMs += responseTimeMs;

  addLog({
    requestId,
    endpoint,
    attempt: attempts,
    responseTimeMs,
    status: 'FAILED',
    message: `[${endpoint}] Failed permanently after ${attempts} attempt(s): ${error.message}`,
  });
}

/**
 * Computes and returns live statistics
 */
function getStats() {
  const resolvedRequests = stats.successfulRequests + stats.failedRequests;
  const retryIncidents = stats.successfulRecoveries + stats.failedRequests;

  const retrySuccessRate = retryIncidents > 0
    ? `${((stats.successfulRecoveries / retryIncidents) * 100).toFixed(1)}%`
    : '100.0%';

  const avgAttempts = stats.totalRequests > 0
    ? (stats.totalAttempts / stats.totalRequests).toFixed(2)
    : '1.00';

  const avgResponseTime = resolvedRequests > 0
    ? `${Math.round(stats.totalResponseTimeMs / resolvedRequests)}ms`
    : '0ms';

  return {
    totalRequests: stats.totalRequests,
    successfulRequests: stats.successfulRequests,
    failedRequests: stats.failedRequests,
    totalRetries: stats.totalRetries,
    successfulRecoveries: stats.successfulRecoveries,
    averageAttemptsPerRequest: avgAttempts,
    retrySuccessRate,
    averageResponseTime: avgResponseTime,
    config: getConfig(),
    recentLogs: activityLogs.slice(0, 50),
  };
}

/**
 * Resets all demo metrics and activity logs
 */
function resetStats() {
  stats.totalRequests = 0;
  stats.successfulRequests = 0;
  stats.failedRequests = 0;
  stats.totalRetries = 0;
  stats.successfulRecoveries = 0;
  stats.totalAttempts = 0;
  stats.totalResponseTimeMs = 0;
  activityLogs = [];

  addLog({
    status: 'SYSTEM',
    message: 'All metrics, request counters, and execution logs have been reset to zero.',
  });

  return getStats();
}

module.exports = {
  addLog,
  recordRequestStart,
  recordAttempt,
  recordRetry,
  recordSuccess,
  recordFailure,
  getStats,
  resetStats,
};
