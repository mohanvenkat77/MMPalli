const YouthContact = require('../models/YouthContact');

const sortByName = { name: 1, createdAt: 1 };

exports.getYouthContacts = async (req, res, next) => {
  try {
    const data = await YouthContact.find().sort(sortByName).lean();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.createYouthContact = async (req, res, next) => {
  try {
    const { name, contacts } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

    const created = await YouthContact.create({
      name: name.trim(),
      contacts: contacts?.trim() || '',
    });

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
};

exports.updateYouthContact = async (req, res, next) => {
  try {
    const { name, contacts } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

    const updated = await YouthContact.findByIdAndUpdate(
      req.params.id,
      { name: name.trim(), contacts: contacts?.trim() || '' },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Youth contact not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteYouthContact = async (req, res, next) => {
  try {
    const deleted = await YouthContact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Youth contact not found' });
    res.json({ success: true, message: 'Youth contact removed' });
  } catch (error) {
    next(error);
  }
};
