const mongoose = require('mongoose');

const BillPaymentSchema = new mongoose.Schema(
  {
    billType: {
      type: String,
      enum: ['electricity', 'mobile', 'internet', 'emi', 'rent'],
      required: true,
    },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    accountNumber: { type: String, required: true },
    status: { type: String, enum: ['completed', 'failed', 'pending'], default: 'completed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BillPayment', BillPaymentSchema);
