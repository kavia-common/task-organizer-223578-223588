'use strict';

// PUBLIC_INTERFACE
function errorHandler(err, req, res, next) {
  /** Centralized error handler that masks internal details. */
  console.error(err && err.stack ? err.stack : err);
  const status = err.status || err.statusCode || 500;
  const message = status >= 500 ? 'Internal Server Error' : err.message || 'Request failed';
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
