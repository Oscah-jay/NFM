/**
 * Paystack Configuration
 * Manages Paystack API credentials and endpoints
 */

const paystackConfig = {
  publicKey: process.env.PAYSTACK_PUBLIC_KEY,
  secretKey: process.env.PAYSTACK_SECRET_KEY,
  baseURL: 'https://api.paystack.co',
  endpoints: {
    verify: '/transaction/verify/',
    initialize: '/transaction/initialize',
    charge: '/charge',
    subscription: '/subscription',
    customer: '/customer',
    plan: '/plan',
    transfer: '/transfer',
  },
};

/**
 * Validate that required Paystack keys are configured
 */
function validatePaystackConfig() {
  if (!paystackConfig.publicKey) {
    throw new Error('PAYSTACK_PUBLIC_KEY is not configured in environment variables');
  }
  if (!paystackConfig.secretKey) {
    throw new Error('PAYSTACK_SECRET_KEY is not configured in environment variables');
  }
}

/**
 * Get Paystack authorization headers
 */
function getPaystackHeaders() {
  validatePaystackConfig();
  return {
    Authorization: `Bearer ${paystackConfig.secretKey}`,
    'Content-Type': 'application/json',
  };
}

module.exports = {
  paystackConfig,
  validatePaystackConfig,
  getPaystackHeaders,
};