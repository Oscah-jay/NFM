/**
 * Error Handler Middleware
 * Centralized error handling for Express
 */

const logger = require('../utils/logger');
const { sendError } = require('../utils/response');

/**
 * Express error handling middleware
 * Must have 4 parameters (err, req, res, next)
 */
function errorHandler(err, req, res, next) {
  logger.error('Unhandled error', {
    message: err.message,
    statusCode: err.statusCode || 500,
    path: req.path,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return sendError(res, message, statusCode, err);
}

module.exports = errorHandler;