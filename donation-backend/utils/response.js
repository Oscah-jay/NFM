/**
 * Response Utility
 * Standardized response format for all API endpoints
 */

/**
 * Send success response
 * 
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {object} data - Response data
 * @param {string} message - Success message
 */
function sendSuccess(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Send error response
 * 
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {object} error - Error details (optional)
 */
function sendError(res, message, statusCode = 400, error = null) {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  return res.status(statusCode).json({
    success: false,
    message,
    error: isDevelopment && error ? error.message : undefined,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Validation error response
 * 
 * @param {object} res - Express response object
 * @param {array} errors - Array of validation errors
 */
function sendValidationError(res, errors) {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: Array.isArray(errors) ? errors : [errors],
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
};