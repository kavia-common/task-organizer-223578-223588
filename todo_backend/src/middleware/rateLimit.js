'use strict';
const rateLimit = require('express-rate-limit');
const { getConfig } = require('../config/env');

// PUBLIC_INTERFACE
function apiRateLimiter() {
  /** Returns express-rate-limit middleware using env config. */
  const cfg = getConfig();
  return rateLimit({
    windowMs: cfg.rateLimit.windowMs,
    max: cfg.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  });
}

module.exports = apiRateLimiter;
