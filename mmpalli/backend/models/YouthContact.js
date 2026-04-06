const mongoose = require('mongoose');

const youthContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contacts: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

youthContactSchema.index({ name: 1 });

module.exports = mongoose.model('YouthContact', youthContactSchema);
