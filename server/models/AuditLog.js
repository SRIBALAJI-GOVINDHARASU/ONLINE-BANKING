const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    action: { type: String, required: true },
    details: { type: Object, default: {} },
    ip: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', AuditLogSchema);
