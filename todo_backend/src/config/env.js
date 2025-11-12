'use strict';
require('dotenv').config();

/**
 * Loads and validates required environment variables for the backend.
 * Fails fast if required variables are missing.
 */

// PUBLIC_INTERFACE
function getConfig() {
  /** Loads config from environment with validation and safe defaults (no secrets hardcoded). */
  const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    mongoUrl: process.env.MONGODB_URL,
    mongoDb: process.env.MONGODB_DB,
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || String(15 * 60 * 1000), 10),
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    },
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
    },
  };

  const missing = [];
  if (!config.mongoUrl) missing.push('MONGODB_URL');
  if (!config.mongoDb) missing.push('MONGODB_DB');

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}`;
    throw new Error(message);
  }
  return config;
}

module.exports = { getConfig };
