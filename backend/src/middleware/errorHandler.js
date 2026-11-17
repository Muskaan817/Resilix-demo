/**
 * Global Error Handler middleware for Resilix Demo
 * Preserves ResilixError diagnostics and original causes
 */

const { ResilixError, ResilixTimeoutError } = require('resilix');

function errorHandler(err, req, res, next) {
  const isResilixError = err instanceof ResilixError;
  const isTimeoutError = err instanceof ResilixTimeoutError;

  const statusCode = err.status || (isResilixError ? 503 : 500);

  const responseBody = {
    success: false,
    error: err.message || 'Internal Server Error',
    name: err.name || 'Error',
    isResilixError,
    isTimeoutError,
    attempts: err.attempts !== undefined ? err.attempts : 1,
    retries: err.retries !== undefined ? err.retries : 0,
    totalDelayMs: err.totalDelay !== undefined ? err.totalDelay : 0,
    originalError: err.originalError ? err.originalError.message : (err.cause ? err.cause.message : null),
    allErrors: Array.isArray(err.errors) ? err.errors.map((e) => (e && e.message ? e.message : String(e))) : [err.message],
  };

  res.status(statusCode).json(responseBody);
}

module.exports = errorHandler;
