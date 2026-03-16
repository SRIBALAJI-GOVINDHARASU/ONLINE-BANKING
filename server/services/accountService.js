const Customer = require('../models/Customer');
const Account = require('../models/Account');

class AccountService {
  async getAccountByCustomer(customerId) {
    return Account.findOne({ customer: customerId });
  }

  async updateProfile(customerId, updates) {
    const allowed = ['name', 'phone', 'address'];
    const data = {};
    allowed.forEach((field) => {
      if (updates[field]) data[field] = updates[field];
    });

    return Customer.findByIdAndUpdate(customerId, data, { new: true, runValidators: true }).select('-password');
  }

  async changePassword(customerId, currentPassword, newPassword) {
    const user = await Customer.findById(customerId);
    if (!user) {
      throw new Error('User not found');
    }
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }
    user.password = newPassword;
    await user.save();
    return true;
  }
}

module.exports = new AccountService();
