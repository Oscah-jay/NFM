/**
 * Request Logger Middleware
 * Logs all incoming HTTP requests
 */

const logger = require('../utils/logger');

/**
 * Middleware to log HTTP requests
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, path, ip } = req;

  // Log when response is sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    logger.info(`${method} ${path}`, {
      statusCode,
      duration: `${duration}ms`,
      ip: ip || req.connection.remoteAddress,
    });
  });

  next();
}

module.exports = requestLogger;