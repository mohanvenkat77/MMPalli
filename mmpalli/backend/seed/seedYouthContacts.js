require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const YouthContact = require('../models/YouthContact');
const youthContacts = require('./youthContactsData');

const seedYouthContacts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const sortedContacts = [...youthContacts].sort((a, b) =>
      a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
    );

    await YouthContact.deleteMany({});
    await YouthContact.insertMany(sortedContacts);

    console.log(`Seeded ${sortedContacts.length} youth contacts.`);
    process.exit(0);
  } catch (error) {
    console.error('Youth contact seed error:', error);
    process.exit(1);
  }
};

seedYouthContacts();
