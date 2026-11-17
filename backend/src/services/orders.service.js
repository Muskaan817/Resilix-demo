/**
 * Orders service demonstrating Resilix with higher failure rates and exhausted retries
 */

const { retry } = require('resilix');
const { ORDERS_DATA, simulateExternalCall } = require('./mockDatabase.service');
const { getConfig } = require('../config/retryConfig');
const {
  recordRequestStart,
  recordAttempt,
  recordRetry,
  recordSuccess,
  recordFailure,
} = require('./stats.service');

/**
 * Executes order settlement with Resilix retry
 *
 * @param {string} requestId - Trace identifier
 * @param {object} [overrideOptions] - Optional overrides
 * @returns {Promise<object>}
 */
async function processOrdersWithRetry(requestId, overrideOptions = {}) {
  const config = { ...getConfig(), ...overrideOptions };
  const startTime = Date.now();
  const endpoint = 'GET /orders';

  recordRequestStart(requestId, endpoint);
  let attemptsMade = 0;

  // Unreliable service: unless explicitly set to immediate_success,
  // defaults to either fail_all or higher baseline failure rate (85%)
  const orderScenario = overrideOptions.scenario || config.scenario;
  const orderFailRate = orderScenario === 'immediate_success' ? 0 : Math.max(0.85, config.failureProbability);

  try {
    const data = await retry(
      async (ctx) => {
        attemptsMade = ctx.attempt;
        recordAttempt(requestId, endpoint, ctx.attempt);

        await simulateExternalCall('PaymentSettlementGateway', ctx.attempt, {
          scenario: orderScenario,
          failureProbability: orderFailRate,
          baseLatency: 140,
        });

        return ORDERS_DATA;
      },
      {
        maxRetries: config.maxRetries,
        initialDelay: config.initialDelay,
        maxDelay: config.maxDelay,
        strategy: config.strategy,
        factor: config.factor,
        jitter: config.jitter,
        timeout: config.timeout,
        name: 'processOrders',
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
      scenarioApplied: orderScenario,
    };
  } catch (error) {
    const responseTimeMs = Date.now() - startTime;
    recordFailure(requestId, endpoint, attemptsMade || 1, error, responseTimeMs);
    throw error;
  }
}

module.exports = {
  processOrdersWithRetry,
};
