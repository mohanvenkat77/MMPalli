const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  collection_name: { type: String, required: true },
  document_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  action: { type: String, required: true, enum: ['INSERT', 'UPDATE', 'DELETE'] },
  old_values: { type: mongoose.Schema.Types.Mixed, default: null },
  new_values: { type: mongoose.Schema.Types.Mixed, default: null },
  performed_by: { type: String, default: 'ADMIN_MOHAN' },
  performed_at: { type: Date, default: Date.now }
});

auditLogSchema.pre('updateOne', function() { throw new Error('Audit logs cannot be modified'); });
auditLogSchema.pre('deleteOne', function() { throw new Error('Audit logs cannot be deleted'); });

module.exports = mongoose.model('AuditLog', auditLogSchema);