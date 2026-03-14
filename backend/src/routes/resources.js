const express = require('express');
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');

const router = express.Router();
const { awardXp } = require('../utils/gamify');

// list resources with simple filters
router.get('/', async (req, res) => {
  try {
    const { subject, grade, q } = req.query;
    const filter = { isPublic: true };
    if (subject) filter.subject = subject;
    if (grade) filter.grade = grade;
    if (q) filter.$text = { $search: q };
    const items = await Resource.find(filter).sort({ createdAt: -1 }).limit(50).populate('author', 'name school');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// get single resource
router.get('/:id', async (req, res) => {
  try {
    const item = await Resource.findById(req.params.id).populate('author', 'name school');
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// create resource (requires auth)
router.post('/', auth, async (req, res) => {
  try {
    const payload = req.body;
    payload.author = req.user._id;
    const resource = await Resource.create(payload);
    // award XP for creating a resource
    try { await awardXp(req.user._id, 50) } catch(e) { console.error('award xp failed', e) }
    // log event for analytics
    try { const Event = require('../models/Event'); await Event.create({ type: 'resource_created', user: req.user._id, meta: { resourceId: resource._id } }) } catch(e){ console.error('log event failed', e) }
    // evaluate badges for the creator
    try { const { evaluateAndAward } = require('../utils/badges'); await evaluateAndAward(req.user._id) } catch(e){ console.error('badge eval failed', e) }
    res.json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// remix (fork) a resource: create a copy credited to original
router.post('/:id/remix', auth, async (req, res) => {
  try {
    const orig = await Resource.findById(req.params.id);
    if (!orig) return res.status(404).json({ message: 'Original not found' });
    const copy = {
      title: req.body.title || orig.title + ' (Remix)',
      description: req.body.description || orig.description,
      subject: req.body.subject || orig.subject,
      grade: req.body.grade || orig.grade,
      curriculumTags: req.body.curriculumTags || orig.curriculumTags,
      files: req.body.files || orig.files,
      author: req.user._id,
      forkFrom: orig._id,
      isPublic: orig.isPublic
    };
    const newRes = await Resource.create(copy);
    orig.forkCount = (orig.forkCount || 0) + 1;
    await orig.save();
    // award XP to remixer and a small XP to original author
    try { await awardXp(req.user._id, 30) } catch(e) { console.error('award xp failed', e) }
    try { if (orig.author) await awardXp(orig.author, 10) } catch(e) { console.error('award xp failed', e) }
    // log remix event
    try { const Event = require('../models/Event'); await Event.create({ type: 'resource_remixed', user: req.user._id, meta: { originalId: orig._id, newId: newRes._id } }) } catch(e){ console.error('log event failed', e) }
    res.json(newRes);
  } catch (err) {
    console.error('remix error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// update resource (author or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Not found' });
    if (resource.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    Object.assign(resource, req.body, { updatedAt: new Date() });
    await resource.save();
    res.json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// delete resource (author or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Not found' });
    if (resource.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await resource.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
