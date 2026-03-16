const notificationService = require('../services/notificationService');

const getNotifications = async (req, res) => {
  const notifications = await notificationService.getNotificationsForCustomer(req.user._id);
  res.json({ notifications });
};

module.exports = { getNotifications };
