/**
 * Paystack Donations Backend
 * Express.js API server for secure payment processing
 * 
 * Structure:
 * - app.js (this file) - Main Express app
 * - config/ - Configuration files
 * - controllers/ - HTTP request handlers
 * - middleware/ - Express middleware
 * - services/ - Business logic
 * - routes/ - API endpoints
 * - utils/ - Helper functions
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const logger = require('./utils/logger');
const { config, corsOptions } = require('./config/server');
const { validatePaystackConfig } = require('./config/paystack');

// Middleware
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

// Routes
const donationRoutes = require('./routes/donationRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Initialize Express app
const app = express();

// ========================================
// MIDDLEWARE SETUP
// ========================================

// Request logging
app.use(requestLogger);

// CORS configuration
app.use(cors(corsOptions));

// Parse JSON
app.use(express.json());

// Parse URL-encoded
app.use(express.urlencoded({ extended: true }));

// ========================================
// ROUTES
// ========================================

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Paystack Donations API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/donations', donationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
});

// Error handler (must be last)
app.use(errorHandler);

// ========================================
// START SERVER
// ========================================

function startServer() {
  try {
    // Validate Paystack configuration
    validatePaystackConfig();
    logger.info('Paystack configuration validated');

    // Start listening
    app.listen(config.port, () => {
      logger.info(`Server started on port ${config.port}`);
      logger.info(`Environment: ${config.env}`);
      logger.info(`Frontend URL: ${config.frontendUrl}`);
      logger.info('');
      logger.info('Available endpoints:');
      logger.info('  POST   /api/donations/verify   - Verify payment');
      logger.info('  POST   /api/donations/webhook  - Webhook handler');
      logger.info('  GET    /api/donations/stats    - Get statistics');
      logger.info('  GET    /api/donations          - Get all donations');
      logger.info('  GET    /api/donations/:id      - Get specific donation');
      logger.info('  GET    /health                 - Health check');
      logger.info('  GET    /api/status             - API status');
      logger.info('');
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.warn('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.warn('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Only start server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = app;