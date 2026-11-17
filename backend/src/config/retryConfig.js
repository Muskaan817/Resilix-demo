/**
 * Runtime retry configuration for Resilix Demo
 */

const defaultConfig = {
  maxRetries: parseInt(process.env.DEFAULT_MAX_RETRIES, 10) || 3,
  initialDelay: parseInt(process.env.DEFAULT_INITIAL_DELAY, 10) || 300,
  maxDelay: parseInt(process.env.DEFAULT_MAX_DELAY, 10) || 5000,
  factor: parseFloat(process.env.DEFAULT_FACTOR) || 2,
  strategy: process.env.DEFAULT_STRATEGY || 'exponential',
  jitter: true,
  timeout: parseInt(process.env.DEFAULT_TIMEOUT, 10) || 4000,
  failureProbability: parseFloat(process.env.DEFAULT_FAILURE_PROBABILITY) || 0.6,
  scenario: 'probabilistic', // 'probabilistic' | 'immediate_success' | 'fail_twice_then_succeed' | 'fail_all'
};

let currentConfig = { ...defaultConfig };

/**
 * Returns a clone of current retry configuration
 */
function getConfig() {
  return { ...currentConfig };
}

/**
 * Validates and updates configuration
 * @param {object} updates - Configuration fields to update
 * @returns {object} Updated configuration
 */
function updateConfig(updates = {}) {
  if (updates.maxRetries !== undefined) {
    const val = Number(updates.maxRetries);
    if (!Number.isInteger(val) || val < 0) {
      throw new Error('maxRetries must be a non-negative integer');
    }
    currentConfig.maxRetries = val;
  }

  if (updates.initialDelay !== undefined) {
    const val = Number(updates.initialDelay);
    if (isNaN(val) || val < 0) {
      throw new Error('initialDelay must be a non-negative number');
    }
    currentConfig.initialDelay = val;
  }

  if (updates.maxDelay !== undefined) {
    const val = Number(updates.maxDelay);
    if (isNaN(val) || val < 0) {
      throw new Error('maxDelay must be a non-negative number');
    }
    currentConfig.maxDelay = val;
  }

  if (updates.factor !== undefined) {
    const val = Number(updates.factor);
    if (isNaN(val) || val < 1) {
      throw new Error('factor must be a number >= 1');
    }
    currentConfig.factor = val;
  }

  if (updates.strategy !== undefined) {
    if (updates.strategy !== 'exponential' && updates.strategy !== 'fixed') {
      throw new Error("strategy must be either 'exponential' or 'fixed'");
    }
    currentConfig.strategy = updates.strategy;
  }

  if (updates.jitter !== undefined) {
    currentConfig.jitter = Boolean(updates.jitter);
  }

  if (updates.timeout !== undefined) {
    const val = Number(updates.timeout);
    if (isNaN(val) || val <= 0) {
      throw new Error('timeout must be a positive number');
    }
    currentConfig.timeout = val;
  }

  if (updates.failureProbability !== undefined) {
    const val = Number(updates.failureProbability);
    if (isNaN(val) || val < 0 || val > 1) {
      throw new Error('failureProbability must be between 0.0 and 1.0');
    }
    currentConfig.failureProbability = val;
  }

  if (updates.scenario !== undefined) {
    const validScenarios = ['probabilistic', 'immediate_success', 'fail_twice_then_succeed', 'fail_all'];
    if (!validScenarios.includes(updates.scenario)) {
      throw new Error(`scenario must be one of: ${validScenarios.join(', ')}`);
    }
    currentConfig.scenario = updates.scenario;
  }

  return getConfig();
}

/**
 * Resets configuration to defaults
 */
function resetConfig() {
  currentConfig = { ...defaultConfig };
  return getConfig();
}

module.exports = {
  getConfig,
  updateConfig,
  resetConfig,
};
