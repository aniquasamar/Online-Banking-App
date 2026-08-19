const mongo = require('mongoose');
const { Schema } = mongo;

const branchSchema = new Schema({
  branchName: {
    type: String,
    unique: true,
    required: true
  },
  branchAddress: {
    type: String,
    required: true
  },
  key: {
    type: String
  }
}, {
  timestamps: true
});

const Branch = mongo.model('Branch', branchSchema);

module.exports = Branch;