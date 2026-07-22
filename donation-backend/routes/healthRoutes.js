/**
 * Health Check Routes
 * Simple endpoints to verify server status
 */

const express = require('express');
const router = express.Router();

/**
 * GET /health
 * Simple health check
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * GET /api/status
 * API status check
 */
router.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Paystack Donations API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      verify: 'POST /api/donations/verify',
      webhook: 'POST /api/donations/webhook',
      stats: 'GET /api/donations/stats',
      donations: 'GET /api/donations',
      donation: 'GET /api/donations/:id',
    },
  });
});

module.exports = router;