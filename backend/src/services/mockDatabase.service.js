/**
 * Mock database and external service simulation
 * Provides artificial latency and deterministic/probabilistic failure scenarios.
 */

// In-memory mock datasets
const USERS_DATA = [
  { id: 'usr_101', name: 'Sarah Chen', email: 'sarah.chen@cloudscale.io', role: 'Principal Architect', tier: 'Enterprise', region: 'us-east-1' },
  { id: 'usr_102', name: 'Alexandre Dubois', email: 'a.dubois@infraops.fr', role: 'Staff SRE', tier: 'Enterprise', region: 'eu-west-1' },
  { id: 'usr_103', name: 'Priya Sharma', email: 'priya.s@datamesh.in', role: 'Lead Data Engineer', tier: 'Professional', region: 'ap-south-1' },
  { id: 'usr_104', name: 'Marcus Vance', email: 'm.vance@securitygrid.com', role: 'SecOps Director', tier: 'Enterprise', region: 'us-west-2' },
  { id: 'usr_105', name: 'Elena Rostova', email: 'e.rostova@fintech-core.eu', role: 'Backend Lead', tier: 'Professional', region: 'eu-central-1' },
];

const PRODUCTS_DATA = [
  { id: 'prd_501', name: 'Distributed Key-Value Cluster', sku: 'KV-ENT-64GB', price: 349.00, stock: 42, latencyTier: 'p99 < 5ms' },
  { id: 'prd_502', name: 'Managed Resilient Message Bus', sku: 'MQ-HIGH-IOPS', price: 799.00, stock: 18, latencyTier: 'p99 < 2ms' },
  { id: 'prd_503', name: 'Global Anycast Edge Gateway', sku: 'EDGE-NET-G', price: 189.50, stock: 120, latencyTier: 'p99 < 1ms' },
  { id: 'prd_504', name: 'High-Throughput Timeseries Store', sku: 'TS-ANALYTICS-4T', price: 499.00, stock: 65, latencyTier: 'p99 < 8ms' },
];

const ORDERS_DATA = [
  { id: 'ord_7701', customer: 'Vertex Media', amount: 1498.00, status: 'Settled', paymentGateway: 'Stripe Global', attemptsRequired: 1 },
  { id: 'ord_7702', customer: 'Quantum Dynamics', amount: 2399.00, status: 'Settled', paymentGateway: 'Adyen Enterprise', attemptsRequired: 2 },
  { id: 'ord_7703', customer: 'Hyperion BioLabs', amount: 4850.00, status: 'Pending Verification', paymentGateway: 'Direct ACH', attemptsRequired: 3 },
];

/**
 * Simulates an external network or database operation.
 *
 * @param {string} serviceName - Name of simulated downstream service
 * @param {number} attempt - Current attempt number (1-based)
 * @param {object} options - Simulation options
 * @param {string} [options.scenario='probabilistic'] - 'immediate_success' | 'fail_twice_then_succeed' | 'fail_all' | 'probabilistic'
 * @param {number} [options.failureProbability=0.6] - Failure probability for probabilistic mode
 * @param {number} [options.baseLatency=100] - Base artificial delay in milliseconds
 * @returns {Promise<any>}
 */
async function simulateExternalCall(serviceName, attempt, options = {}) {
  const scenario = options.scenario || 'probabilistic';
  const failProbability = options.failureProbability !== undefined ? options.failureProbability : 0.6;
  const baseLatency = options.baseLatency || 100;

  // Add realistic artificial latency with jitter
  const latency = baseLatency + Math.floor(Math.random() * 60);
  await new Promise((resolve) => setTimeout(resolve, latency));

  // Determine whether to fail based on scenario
  let shouldFail = false;
  let reason = '';

  if (scenario === 'immediate_success') {
    shouldFail = false;
  } else if (scenario === 'fail_twice_then_succeed') {
    shouldFail = attempt < 3;
    reason = `Deterministic test: planned glitch on attempt #${attempt} (will recover on attempt #3)`;
  } else if (scenario === 'fail_all') {
    shouldFail = true;
    reason = `Deterministic test: persistent downstream outage on attempt #${attempt}`;
  } else {
    // Probabilistic mode
    shouldFail = Math.random() < failProbability;
    reason = `Simulated network/DB transient fault (${Math.round(failProbability * 100)}% failure rate)`;
  }

  if (shouldFail) {
    const errorMessages = [
      `503 Service Unavailable: [${serviceName}] connection pool saturated`,
      `ETIMEDOUT: Connection to [${serviceName}] timed out waiting for socket`,
      `ECONNRESET: Connection reset by peer in [${serviceName}]`,
      `429 Too Many Requests: Rate limit quota exceeded for [${serviceName}]`,
    ];
    const message = `${errorMessages[attempt % errorMessages.length]} (${reason})`;
    const error = new Error(message);
    error.service = serviceName;
    error.attempt = attempt;
    error.status = message.includes('429') ? 429 : 503;
    throw error;
  }

  return true;
}

module.exports = {
  USERS_DATA,
  PRODUCTS_DATA,
  ORDERS_DATA,
  simulateExternalCall,
};
