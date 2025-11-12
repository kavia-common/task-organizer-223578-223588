const express = require('express');
const healthController = require('../controllers/health');
const taskRoutes = require('./taskRoutes');
const categoryRoutes = require('./categoryRoutes');

const router = express.Router();

// Health endpoint
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health check passed
 */
router.get('/', healthController.check.bind(healthController));

// Mount API routes
router.use('/api/tasks', taskRoutes);
router.use('/api/categories', categoryRoutes);

module.exports = router;
