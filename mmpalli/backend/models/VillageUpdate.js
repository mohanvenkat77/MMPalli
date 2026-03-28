const mongoose = require('mongoose');

const VillageUpdateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image_url: { type: String, required: true },
  // Make sure these match your Frontend <select> options exactly!
  category: { 
    type: String, 
    enum: ['BIRTHDAY', 'MARRIAGE', 'FESTIVAL', 'GENERAL', 'NEWS'], 
    default: 'GENERAL' 
  }
}, { timestamps: true });

module.exports = mongoose.model('VillageUpdate', VillageUpdateSchema);