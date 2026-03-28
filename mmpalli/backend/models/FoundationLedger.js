const mongoose = require('mongoose');

const foundationLedgerSchema = new mongoose.Schema({
  txn_date: { type: Date, required: true, default: Date.now },
  financial_year: { type: String, required: true },
  voucher_number: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['CREDIT', 'DEBIT'] },
  category: {
    type: String,
    required: true,
    enum: ['MEMBERSHIP_FEE', 'MONTHLY_FEE', 'DONATION', 'INTEREST', 'OTHER_INCOME', 'EXPENSE']
  },
  amount: { type: Number, required: true, min: [0.01, 'Amount must be > 0'] },
  member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null },
  member_phone: { type: String, default: null },
  paid_to_or_received_from: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  receipt_url: String,
  payment_mode: { type: String, enum: ['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE'], default: 'CASH' }
}, { timestamps: true });

foundationLedgerSchema.index({ financial_year: 1 });
foundationLedgerSchema.index({ txn_date: 1 });
foundationLedgerSchema.index({ type: 1 });
foundationLedgerSchema.index({ member_phone: 1 });

module.exports = mongoose.model('FoundationLedger', foundationLedgerSchema);