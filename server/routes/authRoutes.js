const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const { validateRequest } = require('../middleware/validationMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('phone').notEmpty(),
    body('aadhaarNumber').notEmpty(),
    body('panNumber').notEmpty(),
    body('address').notEmpty(),
  ],
  validateRequest,
  asyncHandler(register)
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validateRequest,
  asyncHandler(login)
);

module.exports = router;
