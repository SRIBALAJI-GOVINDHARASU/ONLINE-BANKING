const connectDB = require('../config/db');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Customer = require('../models/Customer');

const clearData = async () => {
  await connectDB();

  console.log('Deleting all accounts...');
  await Account.deleteMany({});

  console.log('Deleting all transactions...');
  await Transaction.deleteMany({});

  console.log('Deleting all customers...');
  await Customer.deleteMany({});

  console.log('All account, transaction, and customer documents have been deleted.');
  process.exit(0);
};

clearData().catch((err) => {
  console.error('Error clearing data:', err);
  process.exit(1);
});
