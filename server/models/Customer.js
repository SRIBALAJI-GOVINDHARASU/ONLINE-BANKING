const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    aadhaarNumber: { type: String, required: true, unique: true, trim: true },
    panNumber: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: ['customer', 'staff', 'admin'], default: 'customer' },
    address: { type: String, required: true, trim: true },
    isDisabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CustomerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

CustomerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Customer', CustomerSchema);
