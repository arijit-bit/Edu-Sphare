const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const { pool } = require('./config/database');

const port = env.PORT || 4000;

const server = app.listen(port, () => {
  logger.info(`EduSphere Backend running in ${env.NODE_ENV} mode on port ${port}`);
});

// Graceful shutdown handling
function gracefulShutdown(signal) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await pool.end();
      logger.info('Database pool closed.');
      process.exit(0);
    } catch (err) {
      logger.error('Error closing database pool:', err);
      process.exit(1);
    }
  });

  // Force shutdown if taking too long
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

server.on('error', (err) => {
  logger.error('Server encountered an error:', err);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection at:', reason);
});
