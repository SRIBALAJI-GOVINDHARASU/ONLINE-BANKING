const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getNotifications } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/notifications', protect, asyncHandler(getNotifications));

module.exports = router;
