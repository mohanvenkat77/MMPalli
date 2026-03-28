// backend/seed/seedData.js
require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('../models/Member');
const FoundationLedger = require('../models/FoundationLedger');
const VillageLedger = require('../models/VillageLedger');
const NewsHighlight = require('../models/NewsHighlight');
const Counter = require('../models/Counter');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear old data
    await Promise.all([ Member.deleteMany({}), FoundationLedger.deleteMany({}), VillageLedger.deleteMany({}), NewsHighlight.deleteMany({}), Counter.deleteMany({}) ]);
    console.log('Cleared existing data');

    // Members
    const members = await Member.insertMany([
      { full_name: 'Ramesh Kumar', phone_number: '9876543210', join_date: new Date('2024-04-15'), membership_fee_paid: true, status: 'active' },
      { full_name: 'Venkatesh Babu', phone_number: '9876543211', join_date: new Date('2024-04-15'), membership_fee_paid: true, status: 'active' },
      { full_name: 'Srinivas Reddy', phone_number: '9876543213', join_date: new Date('2024-06-10'), membership_fee_paid: true, status: 'active' } // Future defaulter
    ]);
    
    // Counters
    await Counter.create({ _id: 'JBSF_2025-26', sequence_value: members.length });
    await Counter.create({ _id: 'VBA_2025-26', sequence_value: 2 });

    // Foundation Income
    await FoundationLedger.insertMany([
      { txn_date: new Date('2024-05-15'), financial_year: '2025-26', voucher_number: `JBSF/2025-26/0004`, type: 'CREDIT', category: 'MONTHLY_FEE', amount: 100, member_id: members[0]._id, member_phone: '9876543210', paid_to_or_received_from: 'Ramesh Kumar', payment_mode: 'CASH' }
    ]);

    // Village Income
    await VillageLedger.insertMany([
      { txn_date: new Date('2024-05-05'), financial_year: '2025-26', voucher_number: `VBA/2025-26/0001`, type: 'CREDIT', category: 'POND_AUCTION', amount: 50000, party_name: 'Raju Fisheries', description: 'East Pond', payment_mode: 'BANK_TRANSFER' },
      { txn_date: new Date('2024-07-20'), financial_year: '2025-26', voucher_number: `VBA/2025-26/0002`, type: 'DEBIT', category: 'INFRASTRUCTURE_EXPENSE', amount: 15000, party_name: 'ABC Construction', description: 'CC Road repair', payment_mode: 'BANK_TRANSFER' }
    ]);

    await NewsHighlight.create({ month: '2025-01', title: 'Pond Auction Raises Record ₹50,000!', description: 'Great success for the village.', highlight_type: 'ACHIEVEMENT', is_active: true });

    console.log('✅ Seed data complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();