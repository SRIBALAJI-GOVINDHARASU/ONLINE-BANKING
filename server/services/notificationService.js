const EventEmitter = require('events');
const Notification = require('../models/Notification');

class NotificationService extends EventEmitter {
  constructor() {
    super();
    this.on('notify', this.createNotification.bind(this));
  }

  async createNotification({ customerId, message, metadata }) {
    try {
      await Notification.create({
        customer: customerId,
        message,
        metadata: metadata || {},
      });
    } catch (err) {
      console.error('Notification create failed', err.message);
    }
  }

  async getNotificationsForCustomer(customerId) {
    return Notification.find({ customer: customerId }).sort({ createdAt: -1 });
  }
}

module.exports = new NotificationService();
