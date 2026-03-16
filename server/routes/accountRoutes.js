const express = require('express');
const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const {
  getAccount,
  updateProfile,
  changePassword,
  verifyPin,
  getBalance,
  getMobilePassbook,
} = require('../controllers/accountController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/account', protect, asyncHandler(getAccount));
router.post('/account/verify-pin', protect, asyncHandler(verifyPin));
router.get('/balance', protect, asyncHandler(getBalance));
router.get('/passbook', protect, asyncHandler(getMobilePassbook));

router.put(
  '/account/update',
  protect,
  [body('name').optional().notEmpty(), body('phone').optional().notEmpty(), body('address').optional().notEmpty()],
  validateRequest,
  asyncHandler(updateProfile)
);

router.put(
  '/account/change-password',
  protect,
  [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 6 })],
  validateRequest,
  asyncHandler(changePassword)
);

module.exports = router;
