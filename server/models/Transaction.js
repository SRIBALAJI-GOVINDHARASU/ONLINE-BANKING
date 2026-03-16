const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'transfer', 'billPayment'],
      required: true,
    },
    amount: { type: Number, required: true },
    senderAccount: { type: String },
    receiverAccount: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    date: { type: Date, default: Date.now },
    description: { type: String },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
