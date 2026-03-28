const mongoose = require('mongoose');

const villageLedgerSchema = new mongoose.Schema({
  txn_date: { type: Date, required: true, default: Date.now },
  financial_year: { type: String, required: true },
  voucher_number: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['CREDIT', 'DEBIT'] },
  category: {
    type: String,
    required: true,
    enum: [
      'POND_AUCTION', 'GOVERNMENT_FUND', 'DONATION', 'FESTIVAL_COLLECTION', 'INTEREST', 'OTHER_INCOME',
      'INFRASTRUCTURE_EXPENSE', 'FESTIVAL_EXPENSE', 'MAINTENANCE_EXPENSE', 'SALARY_EXPENSE', 'UTILITY_EXPENSE', 'OTHER_EXPENSE'
    ]
  },
  amount: { type: Number, required: true, min: [0.01, 'Amount must be > 0'] },
  party_name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  spent_on_detail: { type: String, trim: true },
  receipt_url: String,
  payment_mode: { type: String, enum: ['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE'], default: 'CASH' }
}, { timestamps: true });

villageLedgerSchema.index({ financial_year: 1 });
villageLedgerSchema.index({ txn_date: 1 });

module.exports = mongoose.model('VillageLedger', villageLedgerSchema);