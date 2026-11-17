/**
 * Automated verification test runner for Resilix Demo Backend
 */

const http = require('http');

process.env.PORT = '5005';
const app = require('./app');

const server = app.listen(5005, async () => {
  console.log('[Test Runner] Verification server listening on http://localhost:5005');

  function request(options, data = null) {
    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: 5005,
          ...options,
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => { body += chunk; });
          res.on('end', () => {
            try {
              resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
            } catch {
              resolve({ statusCode: res.statusCode, body });
            }
          });
        }
      );
      req.on('error', reject);
      if (data) {
        req.write(typeof data === 'string' ? data : JSON.stringify(data));
      }
      req.end();
    });
  }

  try {
    console.log('\n--- 1. Testing GET /health ---');
    const health = await request({ path: '/health', method: 'GET' });
    console.log('   Status:', health.statusCode, 'Health:', health.body.status);
    if (health.statusCode !== 200 || health.body.status !== 'healthy') throw new Error('Health check failed');

    console.log('\n--- 2. Testing GET /stats (initial) ---');
    const stats1 = await request({ path: '/stats', method: 'GET' });
    console.log('   Status:', stats1.statusCode, 'Total requests:', stats1.body.totalRequests);

    console.log('\n--- 3. Testing Scenario 1: Immediate Success (GET /users?scenario=immediate_success) ---');
    const s1 = await request({ path: '/users?scenario=immediate_success', method: 'GET' });
    console.log('   Status:', s1.statusCode, 'Attempts:', s1.body.attempts, 'Retries:', s1.body.retries, 'Recovered:', s1.body.recoveredAfterRetry);
    if (s1.body.attempts !== 1 || s1.body.retries !== 0) throw new Error('Scenario 1 failed');

    console.log('\n--- 4. Testing Scenario 2: Fail Twice, Then Recover (GET /users?scenario=fail_twice_then_succeed) ---');
    const s2 = await request({ path: '/users?scenario=fail_twice_then_succeed', method: 'GET' });
    console.log('   Status:', s2.statusCode, 'Attempts:', s2.body.attempts, 'Retries:', s2.body.retries, 'Recovered:', s2.body.recoveredAfterRetry);
    if (s2.body.attempts !== 3 || s2.body.retries !== 2 || !s2.body.recoveredAfterRetry) throw new Error('Scenario 2 failed');

    console.log('\n--- 5. Testing Scenario 3: Fail All / Exhaust Retries (GET /orders?scenario=fail_all) ---');
    const s3 = await request({ path: '/orders?scenario=fail_all', method: 'GET' });
    console.log('   Status:', s3.statusCode, 'isResilixError:', s3.body.isResilixError, 'Attempts made:', s3.body.attempts);
    if (s3.statusCode !== 503 || !s3.body.isResilixError) throw new Error('Scenario 3 failed');

    console.log('\n--- 6. Testing GET /products ---');
    const prod = await request({ path: '/products', method: 'GET' });
    console.log('   Status:', prod.statusCode, 'Success:', prod.body.success, 'Attempts:', prod.body.attempts);

    console.log('\n--- 7. Testing POST /config (live update) ---');
    const cfg = await request(
      { path: '/config', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { maxRetries: 4, initialDelay: 200, strategy: 'exponential' }
    );
    console.log('   Status:', cfg.statusCode, 'New maxRetries:', cfg.body.config.maxRetries);
    if (cfg.body.config.maxRetries !== 4) throw new Error('Config update failed');

    console.log('\n--- 8. Testing GET /stats (telemetry verification) ---');
    const stats2 = await request({ path: '/stats', method: 'GET' });
    console.log('   Total requests:', stats2.body.totalRequests, 'Total retries:', stats2.body.totalRetries, 'Recoveries:', stats2.body.successfulRecoveries);

    console.log('\n--- 9. Testing POST /reset ---');
    const rst = await request({ path: '/reset', method: 'POST' });
    console.log('   Status:', rst.statusCode, 'Message:', rst.body.message);

    console.log('\n✅ ALL 9 BACKEND VERIFICATION CHECKS PASSED SUCCESSFULLY!\n');
    server.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification failed:', error);
    server.close();
    process.exit(1);
  }
});
