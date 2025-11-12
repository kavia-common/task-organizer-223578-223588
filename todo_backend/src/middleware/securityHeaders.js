'use strict';

// PUBLIC_INTERFACE
function securityHeaders() {
  /** Sets a minimal set of security headers. */
  return (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '0');
    res.setHeader('Referrer-Policy', 'no-referrer');
    // Use single quotes to satisfy linting rules while preserving CSP directives
    res.setHeader('Content-Security-Policy', 'default-src \'self\' \'unsafe-inline\' \'unsafe-eval\' data: blob: http: https:');
    next();
  };
}

module.exports = securityHeaders;
