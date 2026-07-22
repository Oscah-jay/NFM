/**
 * Validation Utility
 * Input validation and sanitization functions
 */

/**
 * Validate email format
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
}

/**
 * Validate donation amount
 * 
 * @param {number} amount - Amount in KES
 * @param {number} minAmount - Minimum allowed amount (default: 10)
 * @returns {boolean} - True if valid
 */
function isValidAmount(amount, minAmount = 10) {
  const num = parseFloat(amount);
  return !isNaN(num) && num >= minAmount;
}

/**
 * Validate reference format
 * Should be the reference returned by Paystack
 * 
 * @param {string} reference - Payment reference
 * @returns {boolean} - True if valid
 */
function isValidReference(reference) {
  return typeof reference === 'string' && reference.trim().length > 0;
}

/**
 * Sanitize string input
 * Remove potentially harmful characters
 * 
 * @param {string} input - String to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeString(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 500); // Limit length
}

/**
 * Sanitize email
 * 
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email
 */
function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Validate donation data
 * 
 * @param {object} data - Donation data
 * @returns {object} - { valid: boolean, errors: array }
 */
function validateDonationData(data) {
  const errors = [];

  // Validate amount
  if (!data.amount || !isValidAmount(data.amount)) {
    errors.push('Invalid donation amount. Minimum is KES 10');
  }

  // Validate email
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Invalid email address');
  }

  // Validate name
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required');
  }

  // Validate purpose (optional but if provided should be valid)
  if (data.purpose && typeof data.purpose !== 'string') {
    errors.push('Invalid donation purpose');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize donation data
 * 
 * @param {object} data - Donation data
 * @returns {object} - Sanitized data
 */
function sanitizeDonationData(data) {
  return {
    amount: parseFloat(data.amount) || 0,
    email: sanitizeEmail(data.email),
    name: sanitizeString(data.name),
    purpose: sanitizeString(data.purpose || ''),
    type: data.type === 'recurring' ? 'recurring' : 'onetime',
    frequency: ['monthly', 'yearly'].includes(data.frequency) ? data.frequency : 'monthly',
    anonymous: Boolean(data.anonymous),
    startingDate: data.startingDate ? new Date(data.startingDate).toISOString() : null,
  };
}

module.exports = {
  isValidEmail,
  isValidAmount,
  isValidReference,
  sanitizeString,
  sanitizeEmail,
  validateDonationData,
  sanitizeDonationData,
};