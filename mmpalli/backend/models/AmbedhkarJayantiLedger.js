const mongoose = require('mongoose');

const ambedhkarJayantiLedgerSchema = new mongoose.Schema({
  txn_date: { type: Date, required: true, default: Date.now },
  financial_year: { type: String, required: true },
  voucher_number: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['CREDIT', 'DEBIT'] },
  category: {
    type: String,
    required: true,
    enum: [
      'CONTRIBUTION',
      'SPONSORSHIP',
      'OTHER_INCOME',
      'FOOD_EXPENSE',
      'STAGE_EXPENSE',
      'DECORATION_EXPENSE',
      'SOUND_EXPENSE',
      'OTHER_EXPENSE'
    ]
  },
  amount: { type: Number, required: true, min: [0.01, 'Amount must be > 0'] },
  contributor_name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  receipt_url: String,
  payment_mode: { type: String, enum: ['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE'], default: 'CASH' }
}, { timestamps: true });

ambedhkarJayantiLedgerSchema.index({ financial_year: 1 });
ambedhkarJayantiLedgerSchema.index({ txn_date: 1 });
ambedhkarJayantiLedgerSchema.index({ type: 1 });

module.exports = mongoose.model('AmbedhkarJayantiLedger', ambedhkarJayantiLedgerSchema);
