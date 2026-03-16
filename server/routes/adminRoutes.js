const express = require('express');
const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const {
  getUsers,
  getTransactions,
  getLogs,
  toggleUser,
  getCollections,
  getDocuments,
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/admin/users', protect, authorizeRoles('admin', 'staff'), asyncHandler(getUsers));
router.get('/admin/transactions', protect, authorizeRoles('admin', 'staff'), asyncHandler(getTransactions));
router.get('/admin/logs', protect, authorizeRoles('admin'), asyncHandler(getLogs));

router.get('/admin/db/collections', protect, authorizeRoles('admin'), asyncHandler(getCollections));
router.get('/admin/db/docs', protect, authorizeRoles('admin'), asyncHandler(getDocuments));

router.post(
  '/admin/user-status',
  protect,
  authorizeRoles('admin'),
  [body('userId').notEmpty(), body('disabled').isBoolean()],
  validateRequest,
  asyncHandler(toggleUser)
);

module.exports = router;
