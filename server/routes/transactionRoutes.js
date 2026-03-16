const express = require('express');
const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const {
  deposit,
  withdraw,
  transfer,
  getTransactions,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/deposit',
  protect,
  [body('accountNumber').notEmpty(), body('amount').isFloat({ gt: 0 })],
  validateRequest,
  asyncHandler(deposit)
);

router.post(
  '/withdraw',
  protect,
  [
    body('accountNumber').notEmpty(),
    body('amount').isFloat({ gt: 0 }),
    body('atmPin').notEmpty(),
  ],
  validateRequest,
  asyncHandler(withdraw)
);

router.post(
  '/transfer',
  protect,
  [
    body('fromAccountNumber').notEmpty(),
    body('toAccountNumber').notEmpty(),
    body('amount').isFloat({ gt: 0 }),
  ],
  validateRequest,
  asyncHandler(transfer)
);

router.get('/transactions', protect, asyncHandler(getTransactions));

module.exports = router;
