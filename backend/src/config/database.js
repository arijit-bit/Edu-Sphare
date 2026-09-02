const { Pool } = require('pg');
const env = require('./env');
const logger = require('../utils/logger');

const isLocalOrTestDb =
  env.DATABASE_URL.includes('localhost') ||
  env.DATABASE_URL.includes('127.0.0.1') ||
  env.DATABASE_URL.includes('edusphare_test') ||
  env.NODE_ENV === 'test';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: isLocalOrTestDb ? false : { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle database client', err);
});

/**
 * Execute a parameterized query.
 * @param {string} text 
 * @param {Array} params 
 * @returns {Promise<import('pg').QueryResult>}
 */
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    logger.error('Database query error:', { text, error: err.message });
    throw err;
  }
}

/**
 * Get a client from the pool for transactions.
 * @returns {Promise<import('pg').PoolClient>}
 */
async function getClient() {
  return pool.connect();
}

module.exports = {
  pool,
  query,
  getClient,
};
