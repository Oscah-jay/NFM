/**
 * Webhook Utility
 * Validates Paystack webhook signatures using HMAC
 */

const crypto = require('crypto');
const logger = require('./logger');

/**
 * Verify webhook signature from Paystack
 * Paystack uses HMAC-SHA512 to sign webhooks
 * 
 * @param {string} hash - The x-paystack-signature header value
 * @param {string} body - The raw request body as string
 * @param {string} secret - Your Paystack secret key
 * @returns {boolean} - True if signature is valid
 */
function verifyWebhookSignature(hash, body, secret) {
  try {
    // Paystack uses SHA512 HMAC
    const signature = crypto
      .createHmac('sha512', secret)
      .update(body)
      .digest('hex');

    const isValid = signature === hash;

    if (!isValid) {
      logger.warn('Invalid webhook signature detected', {
        expectedSignature: hash,
        calculatedSignature: signature,
      });
    }

    return isValid;
  } catch (error) {
    logger.error('Error verifying webhook signature', {
      error: error.message,
      hash: hash ? hash.substring(0, 10) + '...' : 'N/A',
    });
    return false;
  }
}

/**
 * Parse webhook event from Paystack
 * 
 * @param {object} data - The webhook event data
 * @returns {object} - Parsed event object
 */
function parseWebhookEvent(data) {
  return {
    event: data.event,
    reference: data.data?.reference,
    amount: data.data?.amount,
    amountInKES: data.data?.amount / 100, // Paystack sends amount in kobo
    status: data.data?.status,
    customer: data.data?.customer,
    authorization: data.data?.authorization,
    metadata: data.data?.metadata || {},
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  verifyWebhookSignature,
  parseWebhookEvent,
};