/**
 * Donation Service
 * Handles donation business logic with PostgreSQL database
 */

const logger = require('../utils/logger');
const donationModel = require('../models/donationModel');

/**
 * Create pending donation (before payment)
 * 
 * @param {object} donationData - Donation information
 * @returns {object} - Pending donation record
 */
async function createPendingDonation(donationData) {
  try {
    const donation = await donationModel.createPendingDonation({
      reference: donationData.reference,
      amount: donationData.amount,
      email: donationData.email,
      name: donationData.anonymous ? 'Anonymous Donor' : donationData.name,
      purpose: donationData.purpose,
      type: donationData.type,
      frequency: donationData.frequency,
      startingDate: donationData.startingDate,
      anonymous: donationData.anonymous,
      metadata: donationData.metadata || {},
    });

    logger.info('Pending donation created', {
      id: donation.id,
      reference: donation.reference,
      amount: `${donation.amount} KES`,
      email: donation.email,
      status: 'pending',
    });

    return donation;
  } catch (error) {
    logger.error('Error creating pending donation', { error: error.message });
    throw error;
  }
}

/**
 * Record a donation in the database
 * 
 * @param {object} donationData - Donation information
 * @returns {object} - Recorded donation
 */
async function recordDonation(donationData) {
  try {
    const donation = await donationModel.createDonation({
      reference: donationData.reference,
      amount: donationData.amount,
      email: donationData.email,
      name: donationData.anonymous ? 'Anonymous Donor' : donationData.name,
      purpose: donationData.purpose,
      type: donationData.type,
      frequency: donationData.frequency,
      startingDate: donationData.startingDate,
      anonymous: donationData.anonymous,
      status: 'completed',
      metadata: donationData.metadata || {},
    });

    logger.info('Donation recorded', {
      id: donation.id,
      reference: donation.reference,
      amount: `${donation.amount} KES`,
      email: donation.email,
    });

    return donation;
  } catch (error) {
    logger.error('Error recording donation', { error: error.message });
    throw error;
  }
}

/**
 * Get donation by reference
 * 
 * @param {string} reference - Payment reference
 * @returns {object|null} - Donation or null
 */
async function getDonationByReference(reference) {
  try {
    return await donationModel.getDonationByReference(reference);
  } catch (error) {
    logger.error('Error fetching donation by reference', { error: error.message });
    throw error;
  }
}

/**
 * Get donation by ID
 * 
 * @param {string} id - Donation ID
 * @returns {object|null} - Donation or null
 */
async function getDonationById(id) {
  try {
    return await donationModel.getDonationById(id);
  } catch (error) {
    logger.error('Error fetching donation by ID', { error: error.message });
    throw error;
  }
}

/**
 * Get all donations with pagination
 * 
 * @param {object} filters - Filter options
 * @param {number} page - Page number
 * @param {number} limit - Results per page
 * @returns {object} - Donations with pagination info
 */
async function getAllDonations(filters = {}, page = 1, limit = 50) {
  try {
    return await donationModel.getAllDonations(filters, page, limit);
  } catch (error) {
    logger.error('Error fetching donations', { error: error.message });
    throw error;
  }
}

/**
 * Get donation statistics
 * 
 * @returns {object} - Statistics
 */
async function getDonationStats() {
  try {
    const { stats, purposes } = await donationModel.getDonationStats();

    return {
      total: stats.total_donations || 0,
      totalAmount: stats.onetime_total ? parseFloat(stats.onetime_total) : 0,
      recurringMonthlyTotal: stats.recurring_monthly_total ? parseFloat(stats.recurring_monthly_total) : 0,
      averageAmount: stats.avg_donation ? parseFloat(stats.avg_donation) : 0,
      minAmount: stats.min_donation ? parseFloat(stats.min_donation) : 0,
      maxAmount: stats.max_donation ? parseFloat(stats.max_donation) : 0,
      anonymousDonations: stats.anonymous_count || 0,
      namedDonations: stats.named_count || 0,
      purposeCount: stats.purpose_count || 0,
      topPurposes: purposes.map(p => ({
        purpose: p.purpose,
        count: p.count,
        total: parseFloat(p.total) || 0,
      })),
    };
  } catch (error) {
    logger.error('Error fetching donation stats', { error: error.message });
    throw error;
  }
}

/**
 * Update donation status
 * 
 * @param {string} reference - Payment reference
 * @param {string} status - New status
 * @returns {object|null} - Updated donation or null
 */
async function updateDonationStatus(reference, status) {
  try {
    const updated = await donationModel.updateDonationStatus(reference, status);

    if (updated) {
      logger.info('Donation status updated', {
        reference,
        status,
      });
    }

    return updated;
  } catch (error) {
    logger.error('Error updating donation status', { error: error.message });
    throw error;
  }
}

/**
 * Get recurring donations
 * 
 * @returns {array} - Array of recurring donations
 */
async function getRecurringDonations() {
  try {
    return await donationModel.getRecurringDonations();
  } catch (error) {
    logger.error('Error fetching recurring donations', { error: error.message });
    throw error;
  }
}

/**
 * Cancel recurring donation
 * 
 * @param {string} reference - Payment reference
 * @returns {object|null} - Cancelled donation or null
 */
async function cancelRecurringDonation(reference) {
  try {
    const cancelled = await donationModel.cancelRecurringDonation(reference);

    if (cancelled) {
      logger.info('Recurring donation cancelled', { reference });
    }

    return cancelled;
  } catch (error) {
    logger.error('Error cancelling recurring donation', { error: error.message });
    throw error;
  }
}

module.exports = {
  createPendingDonation,
  recordDonation,
  getDonationByReference,
  getDonationById,
  getAllDonations,
  getDonationStats,
  updateDonationStatus,
  getRecurringDonations,
  cancelRecurringDonation,
};
