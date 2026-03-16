const adminService = require('../services/adminService');

const getUsers = async (req, res) => {
  const users = await adminService.listCustomers();
  res.json({ users });
};

const getTransactions = async (req, res) => {
  const transactions = await adminService.listTransactions();
  res.json({ transactions });
};

const getLogs = async (req, res) => {
  const logs = await adminService.listLogs();
  res.json({ logs });
};

const toggleUser = async (req, res) => {
  const { userId, disabled } = req.body;
  const user = await adminService.toggleCustomerStatus(userId, disabled);
  res.json({ message: 'User status updated', user });
};

const getCollections = async (req, res) => {
  const collections = await adminService.listCollections();
  res.json({ collections });
};

const getDocuments = async (req, res) => {
  const { collection, limit } = req.query;
  const docs = await adminService.getDocuments(collection, Number(limit) || 50);
  res.json({ documents: docs });
};

module.exports = {
  getUsers,
  getTransactions,
  getLogs,
  toggleUser,
  getCollections,
  getDocuments,
};
