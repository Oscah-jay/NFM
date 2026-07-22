/**
 * Donation Routes
 * API endpoints for donation operations
 */

const express = require('express');
const router = express.Router();

const donationController = require('../controllers/donationController');
const webhookValidator = require('../middleware/webhookValidator');

/**
 * POST /api/donations/verify
 * Verify a payment with Paystack
 * 
 * Body:
 * {
 *   reference: string (Paystack reference),
 *   name: string (donor name),
 *   email: string (donor email),
 *   purpose: string (donation purpose),
 *   type: string ('onetime' or 'recurring'),
 *   frequency: string ('monthly' or 'yearly'),
 *   anonymous: boolean,
 *   startingDate: string (ISO date for recurring)
 * }
 */
router.post('/verify', donationController.verifyPayment);

/**
 * POST /api/donations/webhook
 * Handle Paystack webhook events
 * Validates webhook signature before processing
 * 
 * Paystack events:
 * - charge.success
 * - charge.failed
 * - subscription.create
 * - subscription.disable
 * - transfer.success
 * - transfer.failed
 */
router.post('/webhook', webhookValidator, donationController.handleWebhook);

/**
 * GET /api/donations/stats
 * Get donation statistics
 * 
 * Returns:
 * {
 *   total: number,
 *   totalAmount: number,
 *   averageAmount: number,
 *   onetimeDonations: number,
 *   recurringDonations: number,
 *   anonymousDonations: number,
 *   topPurposes: array
 * }
 */
router.get('/stats', donationController.getDonationStats);

/**
 * GET /api/donations
 * Get all donations (admin endpoint)
 * 
 * Query parameters:
 * - type: 'onetime' or 'recurring'
 * - anonymous: true or false
 */
router.get('/', donationController.getAllDonations);

/**
 * GET /api/donations/:id
 * Get specific donation by ID
 */
router.get('/:id', donationController.getDonation);

module.exports = router;