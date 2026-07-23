const { Pool } = require('pg');
const logger = require('../utils/logger');

// Validate required environment variables
const validateDatabaseConfig = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL environment variable is required. ' +
      'For Render: Create PostgreSQL database and use the provided DATABASE_URL. ' +
      'For local development: Create .env with: DATABASE_URL=postgresql://user:password@localhost:5432/donations_db'
    );
  }
};

// Create connection pool
const createPool = () => {
  try {
    validateDatabaseConfig();

    const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

    // Handle connection errors
    pool.on('error', (err) => {
      logger.error('Unexpected error on idle client', err);
    });

    // Handle pool connect event
    pool.on('connect', () => {
      logger.info('New database connection established');
    });

    return pool;
  } catch (error) {
    logger.error('Failed to create database pool:', error.message);
    throw error;
  }
};

// Initialize pool
const pool = createPool();

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    logger.info('Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    logger.error('Database connection test failed:', error.message);
    return false;
  }
};

// Query function with error handling
const query = async (text, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 100) {
      logger.warn(`Query took ${duration}ms (slow query):`, text.substring(0, 100));
    }
    return result;
  } catch (error) {
    logger.error('Database query error:', {
      query: text.substring(0, 100),
      error: error.message,
      params: params.length > 0 ? '***' : 'none',
    });
    throw error;
  }
};

// Graceful shutdown
const closePool = async () => {
  try {
    await pool.end();
    logger.info('Database pool closed gracefully');
  } catch (error) {
    logger.error('Error closing database pool:', error.message);
  }
};

module.exports = {
  pool,
  query,
  testConnection,
  closePool,
};