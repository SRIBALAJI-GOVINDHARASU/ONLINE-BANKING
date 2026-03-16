const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema(
  {
    accountNumber: { type: String, required: true, unique: true },
    accountType: { type: String, enum: ['savings', 'current'], default: 'savings' },
    balance: { type: Number, default: 0 },
    atmCardNumber: { type: String, required: true, unique: true },
    atmCvv: { type: String, required: true },
    atmExpiry: { type: String, required: true },
    atmPin: { type: String, required: true },
    mobilePassbookId: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    status: { type: String, enum: ['active', 'disabled', 'pending'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', AccountSchema);
