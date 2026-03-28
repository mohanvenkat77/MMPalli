const mongoose = require('mongoose');

const newsHighlightSchema = new mongoose.Schema({
  month: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  image_url: String,
  highlight_type: { type: String, enum: ['NEWS', 'EVENT', 'ACHIEVEMENT', 'ANNOUNCEMENT'], default: 'NEWS' },
  is_active: { type: Boolean, default: true },
  display_order: { type: Number, default: 0 }
}, { timestamps: true });

newsHighlightSchema.index({ month: 1, is_active: 1 });

module.exports = mongoose.model('NewsHighlight', newsHighlightSchema);