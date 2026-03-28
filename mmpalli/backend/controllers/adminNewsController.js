// backend/controllers/adminNewsController.js
const NewsHighlight = require('../models/NewsHighlight');
const logAudit = require('../middleware/auditLogger');
const VillageUpdate = require('../models/VillageUpdate');
exports.addNews = async (req, res, next) => {
  try {
    const { title, description, month, highlight_type, image_url, display_order } = req.body;
    if (!title || !month) return res.status(400).json({ error: 'title and month are required' });

    const news = await NewsHighlight.create({
      title, description, month, highlight_type: highlight_type || 'NEWS',
      image_url, display_order: display_order || 0
    });

    await logAudit('newshighlights', news._id, 'INSERT', null, news.toObject());
    res.status(201).json({ success: true, data: news });
  } catch (error) { next(error); }
};

exports.updateNews = async (req, res, next) => {
  try {
    const { id, updates } = req.body;
    const updated = await NewsHighlight.findByIdAndUpdate(id, updates, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
};

exports.deleteNews = async (req, res, next) => {
  try {
    const { id } = req.body;
    const news = await NewsHighlight.findById(id);
    if (!news) return res.status(404).json({ error: 'News not found' });

    news.is_active = false;
    await news.save();
    res.json({ success: true, message: 'News deactivated' });
  } catch (error) { next(error); }
};  



exports.addVillageUpdate = async (req, res, next) => {
  try {
    const update = await VillageUpdate.create(req.body);
    res.status(201).json({ success: true, data: update });
  } catch (error) { next(error); }
};

exports.deleteVillageUpdate = async (req, res, next) => {
  try {
    await VillageUpdate.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Update removed' });
  } catch (error) { next(error); }
};

// Public fetch
exports.getVillageUpdates = async (req, res, next) => {
  try {
    const updates = await VillageUpdate.find().sort({ createdAt: -1 });
    res.json(updates);
  } catch (error) { next(error); }
};