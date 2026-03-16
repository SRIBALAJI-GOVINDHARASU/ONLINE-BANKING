const accountService = require('../services/accountService');
const Account = require('../models/Account');

const Customer = require('../models/Customer');

const getAccount = async (req, res) => {
  const account = await accountService.getAccountByCustomer(req.user._id);
  if (!account) {
    return res.status(404).json({ message: 'Account not found' });
  }

  const customer = await Customer.findById(req.user._id).select('-password');

  res.json({
    accountNumber: account.accountNumber,
    accountType: account.accountType,
    balance: account.balance,
    atmCardNumber: account.atmCardNumber,
    mobilePassbookId: account.mobilePassbookId,
    status: account.status,
    name: customer?.name,
    phone: customer?.phone,
    address: customer?.address,
  });
};

const updateProfile = async (req, res) => {
  const updated = await accountService.updateProfile(req.user._id, req.body);
  res.json({ message: 'Profile updated', user: updated });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await accountService.changePassword(req.user._id, currentPassword, newPassword);
  res.json({ message: 'Password updated' });
};

const getBalance = async (req, res) => {
  const account = await accountService.getAccountByCustomer(req.user._id);
  if (!account) {
    return res.status(404).json({ message: 'Account not found' });
  }

  res.json({ balance: account.balance });
};

const verifyPin = async (req, res) => {
  const { pin } = req.body;
  const account = await Account.findOne({ customer: req.user._id });
  if (!account) {
    return res.status(404).json({ message: 'Account not found' });
  }

  if (account.atmPin !== pin) {
    return res.status(403).json({ message: 'Invalid PIN' });
  }

  // Only return card metadata (ATM number, CVV, and expiry) when PIN is verified.
  res.json({
    atmCardNumber: account.atmCardNumber,
    atmCvv: account.atmCvv,
    atmExpiry: account.atmExpiry,
  });
};

const getMobilePassbook = async (req, res) => {
  const account = await Account.findOne({ customer: req.user._id });
  if (!account) {
    return res.status(404).json({ message: 'Account not found' });
  }

  res.json({
    mobilePassbookId: account.mobilePassbookId,
    accountNumber: account.accountNumber,
  });
};

module.exports = {
  getAccount,
  updateProfile,
  changePassword,
  verifyPin,
  getBalance,
  getMobilePassbook,
};
