const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    status: { type: String, enum: ['unread', 'read'], default: 'unread' },
    metadata: { type: Object, default: {} },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
