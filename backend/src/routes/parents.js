const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/parents/children - return linked children for the authenticated parent
router.get('/children', auth, async (req, res) => {
  try {
    const parent = req.user;
    if (parent.role !== 'parent') return res.status(403).json({ message: 'Only parents can access children' });
    await parent.populate('children', 'name email xp level createdAt');
    res.json({ children: parent.children || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/parents/link - link a child account to the authenticated parent by child email
router.post('/link', auth, async (req, res) => {
  try {
    const parent = req.user;
    if (parent.role !== 'parent') return res.status(403).json({ message: 'Only parents can link children' });
    const { childEmail } = req.body;
    if (!childEmail) return res.status(400).json({ message: 'childEmail required' });
    const child = await User.findOne({ email: childEmail });
    if (!child) return res.status(404).json({ message: 'Child account not found' });
    // prevent linking a parent to themselves
    if (child._id.equals(parent._id)) return res.status(400).json({ message: 'Cannot link to self' });
    // add child reference if not already present
    if (!parent.children) parent.children = [];
    const exists = parent.children.some(c => c.equals(child._id));
    if (exists) return res.status(400).json({ message: 'Child already linked' });
    parent.children.push(child._id);
    await parent.save();
    res.json({ message: 'Child linked', child: { id: child._id, name: child.name, email: child.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
