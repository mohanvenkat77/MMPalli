// backend/middleware/auditLogger.js
const AuditLog = require('../models/AuditLog');

const logAudit = async (collectionName, documentId, action, oldValues, newValues) => {
  try {
    await AuditLog.create({
      collection_name: collectionName,
      document_id: documentId,
      action,
      old_values: oldValues,
      new_values: newValues,
      performed_by: 'ADMIN_MOHAN'
    });
  } catch (error) {
    console.error('Audit log error:', error.message);
  }
};

module.exports = logAudit;