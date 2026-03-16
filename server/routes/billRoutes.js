const express = require('express');
const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const { payBill } = require('../controllers/billController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/pay-bill',
  protect,
  [
    body('accountNumber').notEmpty(),
    body('billType').isIn(['electricity', 'mobile', 'internet', 'emi', 'rent']),
    body('amount').isFloat({ gt: 0 }),
  ],
  validateRequest,
  asyncHandler(payBill)
);

module.exports = router;
