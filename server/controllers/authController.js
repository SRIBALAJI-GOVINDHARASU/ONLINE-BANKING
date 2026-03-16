const Customer = require('../models/Customer');
const Account = require('../models/Account');
const { generateToken } = require('../middleware/authMiddleware');
const {
  generateAccountNumber,
  generateAtmCardNumber,
  generateAtmCvv,
  generateAtmExpiry,
  generateAtmPin,
  generateMobilePassbookId,
} = require('../services/factoryService');

const register = async (req, res) => {
  const { name, email, password, phone, aadhaarNumber, panNumber, address } = req.body;

  const existing = await Customer.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const customer = await Customer.create({
    name,
    email,
    password,
    phone,
    aadhaarNumber,
    panNumber,
    address,
    role: 'customer',
  });

  // Create initial bank account
  const account = await Account.create({
    customer: customer._id,
    accountNumber: generateAccountNumber(),
    atmCardNumber: generateAtmCardNumber(),
    atmCvv: generateAtmCvv(),
    atmExpiry: generateAtmExpiry(),
    atmPin: generateAtmPin(),
    mobilePassbookId: generateMobilePassbookId(),
    balance: 0,
  });

  const token = generateToken(customer._id, customer.role);

  res.status(201).json({
    message: 'Registration successful',
    token,
    customer: {
      id: customer._id,
      name: customer.name,
      email: customer.email,
      role: customer.role,
      accountNumber: account.accountNumber,
      mobilePassbookId: account.mobilePassbookId,
    },
    pin: account.atmPin,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Customer.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (user.isDisabled) {
    return res.status(403).json({ message: 'Account disabled' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id, user.role);
  const account = await Account.findOne({ customer: user._id });

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accountNumber: account?.accountNumber,
      balance: account?.balance,
    },
  });
};

module.exports = { register, login };
