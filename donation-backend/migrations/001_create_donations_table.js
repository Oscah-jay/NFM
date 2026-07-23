const { query, testConnection } = require('../config/database');
const logger = require('../utils/logger');

const createDonationsTable = async () => {
  try {
    logger.info('Starting database migration...');

    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Failed to connect to database');
    }

    // Create donations table
    await query(
      `CREATE TABLE IF NOT EXISTS donations (
        id SERIAL PRIMARY KEY,
        reference VARCHAR(255) UNIQUE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        purpose VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('onetime', 'recurring')),
        frequency VARCHAR(50) CHECK (frequency IN ('week', 'month', 'year', NULL)),
        starting_date DATE,
        anonymous BOOLEAN DEFAULT FALSE,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'active')),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT valid_amount CHECK (amount >= 10)
      )`
    );

    logger.info('✓ Donations table created/verified');

    // Create indexes for better query performance
    await query(
      `CREATE INDEX IF NOT EXISTS idx_donations_reference 
       ON donations(reference)`
    );
    logger.info('✓ Index created on reference');

    await query(
      `CREATE INDEX IF NOT EXISTS idx_donations_email 
       ON donations(email)`
    );
    logger.info('✓ Index created on email');

    await query(
      `CREATE INDEX IF NOT EXISTS idx_donations_status 
       ON donations(status)`
    );
    logger.info('✓ Index created on status');

    await query(
      `CREATE INDEX IF NOT EXISTS idx_donations_created_at 
       ON donations(created_at DESC)`
    );
    logger.info('✓ Index created on created_at');

    await query(
      `CREATE INDEX IF NOT EXISTS idx_donations_type 
       ON donations(type)`
    );
    logger.info('✓ Index created on type');

    // Create migration tracking table
    await query(
      `CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      )`
    );

    logger.info('✓ Migrations table created/verified');

    // Record migration
    const migrationName = '001_create_donations_table';
    const migrationExists = await query(
      'SELECT * FROM migrations WHERE name = $1',
      [migrationName]
    );

    if (migrationExists.rows.length === 0) {
      await query(
        'INSERT INTO migrations (name) VALUES ($1)',
        [migrationName]
      );
      logger.info(`✓ Migration recorded: ${migrationName}`);
    } else {
      logger.info(`Migration already executed: ${migrationName}`);
    }

    logger.info('Database migration completed successfully!');
    return true;
  } catch (error) {
    logger.error('Database migration failed:', error.message);
    throw error;
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  createDonationsTable()
    .then(() => {
      logger.info('Migration script finished successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { createDonationsTable };