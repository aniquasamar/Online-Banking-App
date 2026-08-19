const mongo = require('mongoose');
const { Schema } = mongo;

const brandingSchema = new Schema({
  bankName: String,
  bankTagline: String,
  bankLogo: String,
  bankAccountNumber: String,
  bankTransactionId: String,
  bankAddress: String,
  bankLinkedin: String,
  bankTwitter: String,
  bankFacebook: String,
  bankDesc: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Branding = mongo.model('Branding', brandingSchema);

module.exports = Branding;