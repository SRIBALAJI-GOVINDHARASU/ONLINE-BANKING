const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const Transaction = require('../models/Transaction');
const AuditLog = require('../models/AuditLog');

class AdminService {
  async listCustomers() {
    return Customer.find().select('-password').sort({ createdAt: -1 });
  }

  async listTransactions() {
    return Transaction.find().sort({ createdAt: -1 }).limit(200);
  }

  async listLogs() {
    return AuditLog.find().sort({ createdAt: -1 }).limit(200);
  }

  async toggleCustomerStatus(customerId, disabled) {
    return Customer.findByIdAndUpdate(customerId, { isDisabled: disabled }, { new: true });
  }

  async listCollections() {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    return collections.map((c) => c.name);
  }

  async getDocuments(collectionName, limit = 50) {
    const db = mongoose.connection.db;
    if (!(await db.listCollections({ name: collectionName }).hasNext())) {
      throw new Error('Collection not found');
    }
    const docs = await db.collection(collectionName).find({}).limit(limit).toArray();
    return docs;
  }
}

module.exports = new AdminService();
