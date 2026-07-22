/**
 * Webhook Validator Middleware
 * Validates Paystack webhook signatures
 */

const logger = require('../utils/logger');
const { verifyWebhookSignature } = require('../utils/webhook');
const { sendError } = require('../utils/response');

/**
 * Middleware to validate Paystack webhook signature
 */
function validatePaystackWebhook(req, res, next) {
  try {
    // Get signature from headers
    const signature = req.headers['x-paystack-signature'];

    if (!signature) {
      logger.warn('Webhook missing signature header');
      return sendError(res, 'Invalid webhook: Missing signature', 401);
    }

    // Get raw body (Express middleware must parse JSON after this)
    const body = JSON.stringify(req.body);

    // Verify signature
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const isValid = verifyWebhookSignature(signature, body, secret);

    if (!isValid) {
      logger.warn('Webhook signature verification failed');
      return sendError(res, 'Invalid webhook signature', 401);
    }

    logger.debug('Webhook signature verified');
    next();
  } catch (error) {
    logger.error('Error validating webhook', { error: error.message });
    return sendError(res, 'Error validating webhook', 500, error);
  }
}

module.exports = validatePaystackWebhook;