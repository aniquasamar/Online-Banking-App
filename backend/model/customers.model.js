const mongoose = require('mongoose');
const { Schema } = mongoose;

const customersSchema = new Schema(
  {
    accountNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    fathername: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      default: 'bankImages/dummy.jpg',
    },
    signature: {
      type: String,
      default: 'bankImages/dummy.jpg',
    },
    document: {
      type: String,
      default: 'bankImages/dummy.jpg',
    },
    finalBalance: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      default: 'customer',
    },
    branch: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    email: String,    // Ensure this field exists
    mobile: String,
    customerLoginId : String,
  },
  {
    timestamps: true,
  }
);

const Customers = mongoose.model('Customer', customersSchema);

module.exports = Customers;