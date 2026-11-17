/**
 * Products service demonstrating Resilix retry
 */

const { retry } = require('resilix');
const { PRODUCTS_DATA, simulateExternalCall } = require('./mockDatabase.service');
const { getConfig } = require('../config/retryConfig');
const {
  recordRequestStart,
  recordAttempt,
  recordRetry,
  recordSuccess,
  recordFailure,
} = require('./stats.service');

/**
 * Fetches products using Resilix retry engine
 *
 * @param {string} requestId - Trace identifier for request
 * @param {object} [overrideOptions] - Optional per-request scenario overrides
 * @returns {Promise<object>}
 */
async function getProductsWithRetry(requestId, overrideOptions = {}) {
  const config = { ...getConfig(), ...overrideOptions };
  const startTime = Date.now();
  const endpoint = 'GET /products';

  recordRequestStart(requestId, endpoint);
  let attemptsMade = 0;

  try {
    const data = await retry(
      async (ctx) => {
        attemptsMade = ctx.attempt;
        recordAttempt(requestId, endpoint, ctx.attempt);

        await simulateExternalCall('ProductsCatalogCluster', ctx.attempt, {
          scenario: config.scenario,
          failureProbability: config.failureProbability,
          baseLatency: 110,
        });

        return PRODUCTS_DATA;
      },
      {
        maxRetries: config.maxRetries,
        initialDelay: config.initialDelay,
        maxDelay: config.maxDelay,
        strategy: config.strategy,
        factor: config.factor,
        jitter: config.jitter,
        timeout: config.timeout,
        name: 'fetchProducts',
        onRetry: (err, meta) => {
          recordRetry(requestId, endpoint, err, meta);
        },
      }
    );

    const responseTimeMs = Date.now() - startTime;
    recordSuccess(requestId, endpoint, attemptsMade, responseTimeMs);

    return {
      requestId,
      endpoint,
      success: true,
      data,
      attempts: attemptsMade,
      retries: Math.max(0, attemptsMade - 1),
      firstAttemptSuccess: attemptsMade === 1,
      recoveredAfterRetry: attemptsMade > 1,
      responseTimeMs,
      strategyUsed: config.strategy,
      scenarioApplied: config.scenario,
    };
  } catch (error) {
    const responseTimeMs = Date.now() - startTime;
    recordFailure(requestId, endpoint, attemptsMade || 1, error, responseTimeMs);
    throw error;
  }
}

module.exports = {
  getProductsWithRetry,
};
