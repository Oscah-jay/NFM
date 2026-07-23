const { query } = require('../config/database');
const logger = require('../utils/logger');

// Create a new pending donation record (before payment)
const createPendingDonation = async (donationData) => {
  const {
    reference,
    amount,
    email,
    name,
    purpose,
    type,
    frequency,
    startingDate,
    anonymous,
    metadata = {},
  } = donationData;

  try {
    // Convert empty strings to NULL for date fields
    const dateValue = startingDate && startingDate.trim() ? startingDate : null;
    const frequencyValue = frequency && frequency.trim() ? frequency : null;

    const result = await query(
      `INSERT INTO donations (
        reference, amount, email, name, purpose, type, frequency, 
        starting_date, anonymous, status, metadata, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *`,
      [reference, amount, email, name, purpose, type, frequencyValue, dateValue, anonymous, 'pending', JSON.stringify(metadata)]
    );

    logger.info(`Pending donation created: ${reference}`);
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating pending donation:', error.message);
    throw error;
  }
};

// Create a new donation record
const createDonation = async (donationData) => {
  const {
    reference,
    amount,
    email,
    name,
    purpose,
    type,
    frequency,
    startingDate,
    anonymous,
    status = 'completed',
    metadata = {},
  } = donationData;

  try {
    // Convert empty strings to NULL for date/optional fields
    const dateValue = startingDate && startingDate.trim() ? startingDate : null;
    const frequencyValue = frequency && frequency.trim() ? frequency : null;

    const result = await query(
      `INSERT INTO donations (
        reference, amount, email, name, purpose, type, frequency, 
        starting_date, anonymous, status, metadata, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *`,
      [reference, amount, email, name, purpose, type, frequencyValue, dateValue, anonymous, status, JSON.stringify(metadata)]
    );

    logger.info(`Donation created: ${reference}`);
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating donation:', error.message);
    throw error;
  }
};

// Get donation by reference
const getDonationByReference = async (reference) => {
  try {
    const result = await query(
      'SELECT * FROM donations WHERE reference = $1',
      [reference]
    );

    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error fetching donation by reference:', error.message);
    throw error;
  }
};

// Get donation by ID
const getDonationById = async (id) => {
  try {
    const result = await query(
      'SELECT * FROM donations WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error fetching donation by ID:', error.message);
    throw error;
  }
};

// Get all donations with pagination and filtering
const getAllDonations = async (filters = {}, page = 1, limit = 50) => {
  try {
    let whereClause = 'WHERE 1=1';
    const params = [];

    // Apply filters
    if (filters.type) {
      whereClause += ` AND type = $${params.length + 1}`;
      params.push(filters.type);
    }
    if (filters.purpose) {
      whereClause += ` AND purpose = $${params.length + 1}`;
      params.push(filters.purpose);
    }
    if (filters.status) {
      whereClause += ` AND status = $${params.length + 1}`;
      params.push(filters.status);
    }
    if (filters.anonymous !== undefined) {
      whereClause += ` AND anonymous = $${params.length + 1}`;
      params.push(filters.anonymous);
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT * FROM donations ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM donations ${whereClause}`,
      params
    );

    return {
      donations: result.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit),
    };
  } catch (error) {
    logger.error('Error fetching donations:', error.message);
    throw error;
  }
};

// Update donation status
const updateDonationStatus = async (reference, status, metadata = {}) => {
  try {
    const result = await query(
      `UPDATE donations 
       SET status = $1, metadata = jsonb_set(COALESCE(metadata, '{}'::jsonb), '{updated_at}', to_jsonb(NOW()))
       WHERE reference = $2
       RETURNING *`,
      [status, reference]
    );

    if (result.rows.length === 0) {
      logger.warn(`Donation not found for update: ${reference}`);
      return null;
    }

    logger.info(`Donation status updated: ${reference} -> ${status}`);
    return result.rows[0];
  } catch (error) {
    logger.error('Error updating donation status:', error.message);
    throw error;
  }
};

// Get donation statistics
const getDonationStats = async () => {
  try {
    const result = await query(
      `SELECT 
        COUNT(*) as total_donations,
        SUM(CASE WHEN type = 'onetime' THEN amount ELSE 0 END) as onetime_total,
        SUM(CASE WHEN type = 'recurring' THEN amount ELSE 0 END) as recurring_monthly_total,
        COUNT(CASE WHEN anonymous = true THEN 1 END) as anonymous_count,
        COUNT(CASE WHEN anonymous = false THEN 1 END) as named_count,
        MIN(amount) as min_donation,
        MAX(amount) as max_donation,
        ROUND(AVG(amount)::numeric, 2) as avg_donation,
        COUNT(DISTINCT purpose) as purpose_count
      FROM donations WHERE status = 'completed'`
    );

    const purposes = await query(
      `SELECT purpose, COUNT(*) as count, SUM(amount) as total
       FROM donations WHERE status = 'completed'
       GROUP BY purpose ORDER BY total DESC LIMIT 10`
    );

    return {
      stats: result.rows[0],
      purposes: purposes.rows,
    };
  } catch (error) {
    logger.error('Error fetching donation stats:', error.message);
    throw error;
  }
};

// Get recurring donations
const getRecurringDonations = async () => {
  try {
    const result = await query(
      `SELECT * FROM donations 
       WHERE type = 'recurring' AND status = 'active'
       ORDER BY starting_date DESC`
    );

    return result.rows;
  } catch (error) {
    logger.error('Error fetching recurring donations:', error.message);
    throw error;
  }
};

// Cancel recurring donation
const cancelRecurringDonation = async (reference) => {
  try {
    const result = await query(
      `UPDATE donations 
       SET status = 'cancelled', metadata = jsonb_set(COALESCE(metadata, '{}'::jsonb), '{cancelled_at}', to_jsonb(NOW()))
       WHERE reference = $1 AND type = 'recurring'
       RETURNING *`,
      [reference]
    );

    if (result.rows.length === 0) {
      logger.warn(`Recurring donation not found: ${reference}`);
      return null;
    }

    logger.info(`Recurring donation cancelled: ${reference}`);
    return result.rows[0];
  } catch (error) {
    logger.error('Error cancelling recurring donation:', error.message);
    throw error;
  }
};

// Delete donation (admin function)
const deleteDonation = async (id) => {
  try {
    const result = await query(
      'DELETE FROM donations WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      logger.warn(`Donation not found for deletion: ${id}`);
      return null;
    }

    logger.info(`Donation deleted: ${id}`);
    return result.rows[0];
  } catch (error) {
    logger.error('Error deleting donation:', error.message);
    throw error;
  }
};

module.exports = {
  createPendingDonation,
  createDonation,
  getDonationByReference,
  getDonationById,
  getAllDonations,
  updateDonationStatus,
  getDonationStats,
  getRecurringDonations,
  cancelRecurringDonation,
  deleteDonation,
};
