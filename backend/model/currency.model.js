const mongoose = require('mongoose');
const { Schema } = mongoose;

const currencySchema = new Schema({
  currencyName: {
    type: String,
    unique: true,
    required: true
  },
  currencyDesc: {
    type: String,
  },
  key: {
    type: String
  }
}, {
  timestamps: true
});

const Currency = mongoose.model('Currency', currencySchema);

module.exports = Currency;