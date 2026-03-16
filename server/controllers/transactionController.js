const transactionService = require('../services/transactionService');

const deposit = async (req, res) => {
  const { accountNumber, amount } = req.body;
  const transaction = await transactionService.deposit({
    customerId: req.user._id,
    accountNumber,
    amount: Number(amount),
  });

  res.json({ message: 'Deposit completed', transaction });
};

const withdraw = async (req, res) => {
    const { accountNumber, amount, atmPin } = req.body;
  const transaction = await transactionService.withdraw({
    customerId: req.user._id,
    accountNumber,
    amount: Number(amount),
    atmPin,
  });

  res.json({ message: 'Withdrawal completed', transaction });
};

const transfer = async (req, res) => {
  const { fromAccountNumber, toAccountNumber, amount } = req.body;
  const transaction = await transactionService.transfer({
    customerId: req.user._id,
    fromAccountNumber,
    toAccountNumber,
    amount: Number(amount),
  });

  res.json({ message: 'Transfer completed', transaction });
};

const getTransactions = async (req, res) => {
  const transactions = await transactionService.getTransactionsForCustomer(req.user._id);
  res.json({ transactions });
};

module.exports = {
  deposit,
  withdraw,
  transfer,
  getTransactions,
};
