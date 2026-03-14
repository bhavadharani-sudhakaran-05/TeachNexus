const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Log a custom event (public route allowed if needed)
router.post('/log', auth, async (req, res) => {
  try {
    const { type, meta } = req.body;
    if (!type) return res.status(400).json({ message: 'type required' });
    const ev = await Event.create({ type, user: req.user._id, meta });
    res.json({ event: ev });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin summary: top-level counts for recent period
router.get('/summary', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'principal') return res.status(403).json({ message: 'Forbidden' });
    const since = new Date(Date.now() - (req.query.days ? Number(req.query.days)*24*3600*1000 : 7*24*3600*1000));
    const totalEvents = await Event.countDocuments({ createdAt: { $gte: since } });
    const byType = await Event.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    // simple active users (unique users generating events)
    const activeUsers = await Event.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$user' } },
      { $count: 'active' }
    ]);
    res.json({ totalEvents, byType, activeUsers: activeUsers[0]?.active || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Top resources by creation events (example aggregation based on meta.resourceId)
router.get('/top-resources', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'principal') return res.status(403).json({ message: 'Forbidden' });
    const since = new Date(Date.now() - (req.query.days ? Number(req.query.days)*24*3600*1000 : 30*24*3600*1000));
    const items = await Event.aggregate([
      { $match: { type: 'resource_created', createdAt: { $gte: since }, 'meta.resourceId': { $exists: true } } },
      { $group: { _id: '$meta.resourceId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
