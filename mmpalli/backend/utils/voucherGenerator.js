// backend/utils/voucherGenerator.js
const Counter = require('../models/Counter');

const generateVoucherNumber = async (prefix, financialYear) => {
  const sequenceName = `${prefix}_${financialYear}`;
  const seqNum = await Counter.getNextSequence(sequenceName);
  const paddedNum = String(seqNum).padStart(4, '0');
  return `${prefix}/${financialYear}/${paddedNum}`;
};

module.exports = generateVoucherNumber;