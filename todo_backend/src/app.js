const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const securityHeaders = require('./middleware/securityHeaders');
const apiRateLimiter = require('./middleware/rateLimit');
const errorHandler = require('./middleware/errorHandler');
const { getConfig } = require('./config/env');
const { connectMongo } = require('./db/mongo');

const app = express();

// Fail fast on missing env
getConfig();

// Initialize DB and indexes on startup (non-blocking)
connectMongo().catch((err) => {
  console.error('Failed to connect to MongoDB on startup:', err);
  process.exit(1);
});

// CORS
const cfg = getConfig();
app.use(cors({ origin: cfg.cors.origin }));

// Security headers
app.use(securityHeaders());

// Trust proxy for accurate protocol
app.set('trust proxy', true);

// Swagger UI with dynamic server URL
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  let protocol = req.secure ? 'https' : req.protocol;
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [{ url: `${protocol}://${fullHost}` }],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Expose raw OpenAPI JSON
app.get('/openapi.json', (req, res) => {
  const host = req.get('host');
  const protocol = req.secure ? 'https' : req.protocol;
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  res.json({
    ...swaggerSpec,
    servers: [{ url: `${protocol}://${fullHost}` }],
  });
});

// JSON body parsing
app.use(express.json({ limit: '1mb' }));

// Rate limiting (after docs)
app.use('/api', apiRateLimiter());

// Mount routes
app.use('/', routes);

// Centralized error handling
app.use(errorHandler);

module.exports = app;
