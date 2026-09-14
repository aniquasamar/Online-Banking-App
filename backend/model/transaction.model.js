const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionsSchema = new Schema(
  {
    accountNumber: {
      type: Number,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    remark: {
      type: String,
      required: true,
    },
    currentBalance: {
      type: Number,
      required: true,
    },
    finalBalance: {
      type: Number,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transactions = mongoose.model('Transaction', transactionsSchema);

module.exports = Transactions;