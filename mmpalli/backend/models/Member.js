const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  father_name: { type: String, trim: true },
  phone_number: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: 'Please enter a valid 10-digit Indian phone number'
    }
  },
  join_date: { type: Date, required: true, default: Date.now },
  membership_fee_paid: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  address: { type: String, trim: true },
  photo_url: String
}, { timestamps: true });

memberSchema.index({ phone_number: 1 });
memberSchema.index({ status: 1 });

module.exports = mongoose.model('Member', memberSchema);