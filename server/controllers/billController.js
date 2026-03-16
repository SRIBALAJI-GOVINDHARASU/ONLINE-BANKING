const transactionService = require('../services/transactionService');

const payBill = async (req, res) => {
  const { accountNumber, billType, amount } = req.body;

  const { bill, transaction } = await transactionService.payBill({
    customerId: req.user._id,
    accountNumber,
    billType,
    amount: Number(amount),
  });

  res.json({ message: 'Bill paid successfully', bill, transaction });
};

module.exports = { payBill };
