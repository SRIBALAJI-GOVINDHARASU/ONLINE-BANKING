const Customer = require('../models/Customer');
const Account = require('../models/Account');
const {
  generateAccountNumber,
  generateAtmCardNumber,
  generateAtmCvv,
  generateAtmExpiry,
  generateAtmPin,
  generateMobilePassbookId,
} = require('../services/factoryService');

const createIfMissing = async () => {
  const admin = await Customer.findOne({ role: 'admin' });
  if (!admin) {
    const adminUser = await Customer.create({
      name: 'Admin User',
      email: 'admin@bank.com',
      password: 'Admin@123',
      phone: '0000000000',
      aadhaarNumber: '000000000000',
      panNumber: 'ADMIN0000',
      address: 'Head Office',
      role: 'admin',
    });

    await Account.create({
      customer: adminUser._id,
      accountNumber: generateAccountNumber(),
      atmCardNumber: generateAtmCardNumber(),
      atmCvv: generateAtmCvv(),
      atmExpiry: generateAtmExpiry(),
      atmPin: generateAtmPin(),
      mobilePassbookId: generateMobilePassbookId(),
      balance: 0,
    });

    console.log('Seeded default admin: admin@bank.com / Admin@123');
  }
};

module.exports = { createIfMissing };
