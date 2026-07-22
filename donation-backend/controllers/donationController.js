/**
 * Donation Controller
 * Handles HTTP requests for donation endpoints
 */

const logger = require('../utils/logger');
const { sendSuccess, sendError, sendValidationError } = require('../utils/response');
const { validateDonationData, sanitizeDonationData, isValidReference } = require('../utils/validation');
const paystackService = require('../services/paystackService');
const donationService = require('../services/donationService');

/**
 * POST /api/donations/verify
 * Verify a payment with Paystack
 */
async function verifyPayment(req, res) {
  try {
    const { reference } = req.body;

    // Validate reference
    if (!isValidReference(reference)) {
      logger.warn('Invalid reference provided', { reference });
      return sendValidationError(res, 'Invalid payment reference');
    }

    // Verify with Paystack
    const verification = await paystackService.verifyPayment(reference);

    if (!verification.success) {
      logger.warn('Payment verification failed', { reference });
      return sendError(res, verification.message, 400);
    }

    const { data } = verification;

    // Check if donation already recorded
    let donation = donationService.getDonationByReference(reference);

    if (!donation) {
      // Record the donation
      const donationData = {
        reference: data.reference,
        amount: data.amountInKES,
        amountInKES: data.amountInKES,
        email: data.customer.email,
        name: req.body.name || 'Anonymous',
        anonymous: req.body.anonymous || false,
        purpose: req.body.purpose || '',
        type: req.body.type || 'onetime',
        frequency: req.body.frequency,
        startingDate: req.body.startingDate,
        metadata: data.metadata,
      };

      donation = donationService.recordDonation(donationData);
    }

    logger.info('Payment verified and recorded', {
      reference,
      amount: `${data.amountInKES} KES`,
    });

    return sendSuccess(res, {
      donation,
      verification: data,
    }, 'Payment verified successfully', 200);
  } catch (error) {
    logger.error('Error in verifyPayment', { error: error.message });
    return sendError(res, 'Error verifying payment', 500, error);
  }
}

/**
 * POST /api/donations/webhook
 * Handle Paystack webhook events
 */
async function handleWebhook(req, res) {
  try {
    const { event, data } = req.body;

    logger.info('Webhook received', { event, reference: data?.reference });

    switch (event) {
      case 'charge.success':
        await handleChargeSuccess(data);
        break;

      case 'charge.failed':
        await handleChargeFailed(data);
        break;

      case 'subscription.create':
        await handleSubscriptionCreate(data);
        break;

      case 'subscription.disable':
        await handleSubscriptionDisable(data);
        break;

      default:
        logger.debug('Unhandled webhook event', { event });
    }

    // Paystack requires 200 response
    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Error handling webhook', { error: error.message });
    // Still return 200 to Paystack
    return res.status(200).json({ success: true });
  }
}

/**
 * Handle successful charge
 */
async function handleChargeSuccess(data) {
  try {
    const reference = data.reference;
    const donation = donationService.getDonationByReference(reference);

    if (donation) {
      donationService.updateDonationStatus(reference, 'completed');
      logger.info('Donation marked as completed', { reference });
    }
  } catch (error) {
    logger.error('Error handling charge success', { error: error.message });
  }
}

/**
 * Handle failed charge
 */
async function handleChargeFailed(data) {
  try {
    const reference = data.reference;
    const donation = donationService.getDonationByReference(reference);

    if (donation) {
      donationService.updateDonationStatus(reference, 'failed');
      logger.info('Donation marked as failed', { reference });
    }
  } catch (error) {
    logger.error('Error handling charge failed', { error: error.message });
  }
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreate(data) {
  try {
    logger.info('New subscription created', {
      reference: data.reference,
      subscriptionCode: data.subscription_code,
    });
    // Implement subscription handling logic here
  } catch (error) {
    logger.error('Error handling subscription creation', { error: error.message });
  }
}

/**
 * Handle subscription disable
 */
async function handleSubscriptionDisable(data) {
  try {
    logger.info('Subscription disabled', {
      subscriptionCode: data.subscription_code,
    });
    // Implement subscription disable logic here
  } catch (error) {
    logger.error('Error handling subscription disable', { error: error.message });
  }
}

/**
 * GET /api/donations/stats
 * Get donation statistics
 */
function getDonationStats(req, res) {
  try {
    const stats = donationService.getDonationStats();
    return sendSuccess(res, stats, 'Donation statistics retrieved', 200);
  } catch (error) {
    logger.error('Error getting donation stats', { error: error.message });
    return sendError(res, 'Error getting statistics', 500, error);
  }
}

/**
 * GET /api/donations
 * Get all donations (admin)
 */
function getAllDonations(req, res) {
  try {
    const { type, anonymous } = req.query;
    const filters = {};

    if (type) filters.type = type;
    if (anonymous !== undefined) filters.anonymous = anonymous === 'true';

    const donations = donationService.getAllDonations(filters);
    return sendSuccess(res, { donations, total: donations.length }, 'Donations retrieved', 200);
  } catch (error) {
    logger.error('Error getting all donations', { error: error.message });
    return sendError(res, 'Error retrieving donations', 500, error);
  }
}

/**
 * GET /api/donations/:id
 * Get specific donation
 */
function getDonation(req, res) {
  try {
    const { id } = req.params;
    const donation = donationService.getDonationById(id);

    if (!donation) {
      return sendError(res, 'Donation not found', 404);
    }

    return sendSuccess(res, donation, 'Donation retrieved', 200);
  } catch (error) {
    logger.error('Error getting donation', { error: error.message });
    return sendError(res, 'Error retrieving donation', 500, error);
  }
}

module.exports = {
  verifyPayment,
  handleWebhook,
  getDonationStats,
  getAllDonations,
  getDonation,
};