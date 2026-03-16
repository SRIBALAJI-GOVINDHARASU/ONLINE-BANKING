const jwt = require('jsonwebtoken');

const maintenanceMiddleware = (req, res, next) => {
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const isMaintenanceDay = today.getDate() === lastDayOfMonth;

  if (!isMaintenanceDay) {
    return next();
  }

  // During maintenance, only admins may access endpoints.
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(503).json({
      message:
        'The system is under maintenance. Please try again after the maintenance window.',
      maintenance: true,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    if (decoded.role !== 'admin') {
      return res.status(503).json({
        message:
          'The system is under maintenance. Please try again after the maintenance window.',
        maintenance: true,
      });
    }
  } catch (err) {
    return res.status(503).json({
      message:
        'The system is under maintenance. Please try again after the maintenance window.',
      maintenance: true,
    });
  }

  next();
};

module.exports = { maintenanceMiddleware };
