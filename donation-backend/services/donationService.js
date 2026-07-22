/**
 * Donation Service
 * Handles donation business logic
 */

const logger = require('../utils/logger');

// In-memory storage (replace with database in production)
const donations = [];

/**
 * Record a donation
 * 
 * @param {object} donationData - Donation information
 * @returns {object} - Recorded donation
 */
function recordDonation(donationData) {
  try {
    const donation = {
      id: generateDonationId(),
      reference: donationData.reference,
      amount: donationData.amount,
      amountInKES: donationData.amountInKES,
      email: donationData.email,
      name: donationData.anonymous ? 'Anonymous Donor' : donationData.name,
      anonymous: donationData.anonymous,
      purpose: donationData.purpose,
      type: donationData.type, // 'onetime' or 'recurring'
      frequency: donationData.frequency, // 'monthly', 'yearly'
      startingDate: donationData.startingDate,
      status: 'completed',
      metadata: donationData.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    donations.push(donation);

    logger.info('Donation recorded', {
      id: donation.id,
      reference: donation.reference,
      amount: `${donation.amountInKES} KES`,
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
function getDonationByReference(reference) {
  return donations.find(d => d.reference === reference) || null;
}

/**
 * Get donation by ID
 * 
 * @param {string} id - Donation ID
 * @returns {object|null} - Donation or null
 */
function getDonationById(id) {
  return donations.find(d => d.id === id) || null;
}

/**
 * Get all donations
 * 
 * @param {object} filters - Filter options
 * @returns {array} - Array of donations
 */
function getAllDonations(filters = {}) {
  let result = [...donations];

  if (filters.anonymous !== undefined) {
    result = result.filter(d => d.anonymous === filters.anonymous);
  }

  if (filters.type) {
    result = result.filter(d => d.type === filters.type);
  }

  if (filters.status) {
    result = result.filter(d => d.status === filters.status);
  }

  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Get donation statistics
 * 
 * @returns {object} - Statistics
 */
function getDonationStats() {
  const total = donations.length;
  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const averageAmount = total > 0 ? totalAmount / total : 0;
  const onetimeDonations = donations.filter(d => d.type === 'onetime').length;
  const recurringDonations = donations.filter(d => d.type === 'recurring').length;
  const anonymousDonations = donations.filter(d => d.anonymous).length;

  return {
    total,
    totalAmount,
    averageAmount: Math.round(averageAmount * 100) / 100,
    onetimeDonations,
    recurringDonations,
    anonymousDonations,
    topPurposes: getTopPurposes(),
  };
}

/**
 * Get top donation purposes
 * 
 * @returns {array} - Top purposes with counts
 */
function getTopPurposes() {
  const purposes = {};

  donations.forEach(d => {
    if (d.purpose) {
      purposes[d.purpose] = (purposes[d.purpose] || 0) + 1;
    }
  });

  return Object.entries(purposes)
    .map(([purpose, count]) => ({ purpose, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

/**
 * Update donation status
 * 
 * @param {string} reference - Payment reference
 * @param {string} status - New status
 * @returns {object|null} - Updated donation or null
 */
function updateDonationStatus(reference, status) {
  const donation = getDonationByReference(reference);

  if (!donation) {
    return null;
  }

  donation.status = status;
  donation.updatedAt = new Date().toISOString();

  logger.info('Donation status updated', {
    reference,
    status,
  });

  return donation;
}

/**
 * Generate unique donation ID
 * 
 * @returns {string} - Donation ID
 */
function generateDonationId() {
  return `DON_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

module.exports = {
  recordDonation,
  getDonationByReference,
  getDonationById,
  getAllDonations,
  getDonationStats,
  getTopPurposes,
  updateDonationStatus,
  generateDonationId,
};