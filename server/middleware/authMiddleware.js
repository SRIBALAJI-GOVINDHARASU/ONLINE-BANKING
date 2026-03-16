const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

const authMiddleware = {};

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secretkey', {
    expiresIn: '7d',
  });
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      const user = await Customer.findById(decoded.id).select('-password');

      if (!user || user.isDisabled) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

authMiddleware.generateToken = generateToken;
authMiddleware.protect = protect;
authMiddleware.authorizeRoles = authorizeRoles;

module.exports = authMiddleware;
