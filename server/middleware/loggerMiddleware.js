const AuditLog = require('../models/AuditLog');

const logger = async (req, res, next) => {
  // Basic request logging; errors are handled by error handler.
  const userId = req.user ? req.user._id : null;
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Store log asynchronously without blocking response
  try {
    await AuditLog.create({
      user: userId,
      action: `${req.method} ${req.originalUrl}`,
      details: {
        body: req.body,
        query: req.query,
      },
      ip,
    });
  } catch (error) {
    // swallow to avoid blocking requests
    console.error('AuditLog error', error.message);
  }

  next();
};

module.exports = { logger };
