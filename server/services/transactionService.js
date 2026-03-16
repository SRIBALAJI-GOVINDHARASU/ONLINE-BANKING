const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const BillPayment = require('../models/BillPayment');
const notificationService = require('./notificationService');

class TransactionService {
  async getTransactionsForCustomer(customerId) {
    return Transaction.find({ customer: customerId }).sort({ createdAt: -1 });
  }

  async deposit({ customerId, accountNumber, amount }) {
    const account = await Account.findOne({ accountNumber, customer: customerId });
    if (!account) {
      throw new Error('Account not found');
    }

    account.balance += amount;
    await account.save();

    const transaction = await Transaction.create({
      type: 'deposit',
      amount,
      receiverAccount: accountNumber,
      customer: customerId,
      description: 'Deposit to account',
    });

    notificationService.emit('notify', {
      customerId,
      message: `₹${amount} deposited successfully. New balance: ₹${account.balance}`,
      metadata: { transactionId: transaction._id },
    });

    return transaction;
  }

  async withdraw({ customerId, accountNumber, amount, atmPin }) {
    const account = await Account.findOne({ accountNumber, customer: customerId });
    if (!account) {
      throw new Error('Account not found');
    }

    if (!atmPin || account.atmPin !== atmPin) {
      const err = new Error('Invalid ATM PIN');
      err.statusCode = 403;
      throw err;
    }

    if (account.balance < amount) {
      const err = new Error('Insufficient balance');
      err.statusCode = 400;
      throw err;
    }

    account.balance -= amount;
    await account.save();

    const transaction = await Transaction.create({
      type: 'withdrawal',
      amount,
      senderAccount: accountNumber,
      customer: customerId,
      description: 'Withdrawal from account',
    });

    notificationService.emit('notify', {
      customerId,
      message: `₹${amount} withdrawn successfully. New balance: ₹${account.balance}`,
      metadata: { transactionId: transaction._id },
    });

    return transaction;
  }

  async transfer({ customerId, fromAccountNumber, toAccountNumber, amount }) {
    const from = await Account.findOne({ accountNumber: fromAccountNumber, customer: customerId });
    const to = await Account.findOne({ accountNumber: toAccountNumber });

    if (!from) {
      throw new Error('Source account not found');
    }
    if (!to) {
      throw new Error('Destination account not found');
    }
    if (from.balance < amount) {
      throw new Error('Insufficient balance');
    }

    from.balance -= amount;
    to.balance += amount;

    await from.save();
    await to.save();

    const senderTransaction = await Transaction.create({
      type: 'transfer',
      amount,
      senderAccount: fromAccountNumber,
      receiverAccount: toAccountNumber,
      customer: customerId,
      description: `Transfer to ${toAccountNumber}`,
    });

    // Also record transaction for the receiver's customer history
    const receiverTransaction = await Transaction.create({
      type: 'transfer',
      amount,
      senderAccount: fromAccountNumber,
      receiverAccount: toAccountNumber,
      customer: to.customer,
      description: `Transfer from ${fromAccountNumber}`,
    });

    notificationService.emit('notify', {
      customerId,
      message: `₹${amount} transferred to ${toAccountNumber}. New balance: ₹${from.balance}`,
      metadata: { transactionId: senderTransaction._id },
    });

    return senderTransaction;
  }

  async payBill({ customerId, accountNumber, billType, amount }) {
    const account = await Account.findOne({ accountNumber, customer: customerId });
    if (!account) {
      throw new Error('Account not found');
    }
    if (account.balance < amount) {
      throw new Error('Insufficient balance');
    }

    account.balance -= amount;
    await account.save();

    const bill = await BillPayment.create({
      billType,
      amount,
      customer: customerId,
      accountNumber,
      status: 'completed',
    });

    const transaction = await Transaction.create({
      type: 'billPayment',
      amount,
      senderAccount: accountNumber,
      customer: customerId,
      description: `Bill payment - ${billType}`,
    });

    notificationService.emit('notify', {
      customerId,
      message: `₹${amount} paid for ${billType}. New balance: ₹${account.balance}`,
      metadata: { transactionId: transaction._id, billId: bill._id },
    });

    return { bill, transaction };
  }
}

module.exports = new TransactionService();
