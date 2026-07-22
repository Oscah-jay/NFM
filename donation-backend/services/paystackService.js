/**
 * Paystack Service
 * Handles all Paystack API interactions
 */

const axios = require('axios');
const logger = require('../utils/logger');
const { paystackConfig, getPaystackHeaders } = require('../config/paystack');

/**
 * Verify payment with Paystack
 * 
 * @param {string} reference - Payment reference from Paystack
 * @returns {object} - Payment verification result
 */
async function verifyPayment(reference) {
  try {
    if (!reference) {
      throw new Error('Reference is required');
    }

    const url = `${paystackConfig.baseURL}${paystackConfig.endpoints.verify}${reference}`;
    const headers = getPaystackHeaders();

    logger.debug(`Verifying payment: ${reference}`);

    const response = await axios.get(url, { headers });

    if (response.status !== 200) {
      throw new Error(`Paystack API error: ${response.status}`);
    }

    const { status, data } = response.data;

    if (status !== true) {
      logger.warn('Payment verification failed', { reference, status });
      return {
        success: false,
        message: 'Payment verification failed',
        reference,
      };
    }

    logger.info('Payment verified successfully', {
      reference,
      amount: data.amount,
      status: data.status,
    });

    return {
      success: true,
      message: 'Payment verified',
      data: {
        reference: data.reference,
        amount: data.amount, // in kobo (divide by 100 for KES)
        amountInKES: data.amount / 100,
        status: data.status,
        paidAt: data.paid_at,
        customer: {
          email: data.customer.email,
          id: data.customer.id,
        },
        authorization: data.authorization,
        metadata: data.metadata || {},
      },
    };
  } catch (error) {
    logger.error('Error verifying payment', {
      reference,
      error: error.message,
    });

    return {
      success: false,
      message: 'Error verifying payment: ' + error.message,
      reference,
    };
  }
}

/**
 * Initialize transaction
 * Gets authorization URL for payment
 * 
 * @param {object} paymentData - Payment initialization data
 * @returns {object} - Initialization result
 */
async function initializeTransaction(paymentData) {
  try {
    const {
      email,
      amount, // in KES
      reference,
      metadata = {},
    } = paymentData;

    if (!email || !amount || !reference) {
      throw new Error('Email, amount, and reference are required');
    }

    const url = `${paystackConfig.baseURL}${paystackConfig.endpoints.initialize}`;
    const headers = getPaystackHeaders();

    const requestBody = {
      email,
      amount: Math.round(amount * 100), // Convert to kobo
      reference,
      metadata,
    };

    logger.debug('Initializing transaction', {
      email,
      amount: `${amount} KES`,
      reference,
    });

    const response = await axios.post(url, requestBody, { headers });

    if (response.status !== 200) {
      throw new Error(`Paystack API error: ${response.status}`);
    }

    const { status, data } = response.data;

    if (status !== true) {
      throw new Error('Transaction initialization failed');
    }

    logger.info('Transaction initialized', {
      reference,
      authorizationUrl: data.authorization_url,
    });

    return {
      success: true,
      data: {
        reference: data.reference,
        authorizationUrl: data.authorization_url,
        accessCode: data.access_code,
      },
    };
  } catch (error) {
    logger.error('Error initializing transaction', {
      error: error.message,
    });

    return {
      success: false,
      message: 'Error initializing transaction: ' + error.message,
    };
  }
}

/**
 * Get transaction details
 * 
 * @param {string} reference - Payment reference
 * @returns {object} - Transaction details
 */
async function getTransactionDetails(reference) {
  try {
    const url = `${paystackConfig.baseURL}${paystackConfig.endpoints.verify}${reference}`;
    const headers = getPaystackHeaders();

    const response = await axios.get(url, { headers });

    if (response.status !== 200) {
      throw new Error(`Paystack API error: ${response.status}`);
    }

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    logger.error('Error getting transaction details', {
      reference,
      error: error.message,
    });

    return {
      success: false,
      message: 'Error getting transaction details',
    };
  }
}

module.exports = {
  verifyPayment,
  initializeTransaction,
  getTransactionDetails,
};