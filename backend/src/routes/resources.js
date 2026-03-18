const express = require('express');
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');
const { isValidMongoId, validateResourcePayload, sanitizeString } = require('../utils/validators');
const { awardXp } = require('../utils/gamify');

const router = express.Router();

// list resources with simple filters
router.get('/', async (req, res) => {
  try {
    const { subject, grade, q } = req.query;
    const filter = { isPublic: true };
    
    if (subject) filter.subject = sanitizeString(subject).toLowerCase();
    if (grade) filter.grade = sanitizeString(grade).toLowerCase();
    if (q) {
      const searchTerm = sanitizeString(q);
      if (searchTerm.length > 0) {
        filter.$text = { $search: searchTerm };
      }
    }
    
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const skip = Math.max(0, parseInt(req.query.skip) || 0);
    
    const items = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name school');
      
    res.json({ items, count: items.length });
  } catch (err) {
    console.error('resources list error', err.message);
    res.status(500).json({ message: 'Failed to fetch resources' });
  }
});

// get single resource
router.get('/:id', async (req, res) => {
  try {
    if (!isValidMongoId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid resource ID' });
    }
    
    const item = await Resource.findById(req.params.id).populate('author', 'name school');
    if (!item) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.json(item);
  } catch (err) {
    console.error('resource get error', err.message);
    res.status(500).json({ message: 'Failed to fetch resource' });
  }
});

// create resource (requires auth)
router.post('/', auth, async (req, res) => {
  try {
    // Validate payload
    const errors = validateResourcePayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    
    const payload = {
      ...req.body,
      author: req.user._id,
      title: sanitizeString(req.body.title),
      description: req.body.description ? sanitizeString(req.body.description) : '',
      subject: sanitizeString(req.body.subject).toLowerCase(),
      grade: sanitizeString(req.body.grade).toLowerCase()
    };
    
    const resource = await Resource.create(payload);
    
    // Award XP
    try {
      await awardXp(req.user._id, 50);
    } catch(e) {
      console.error('award xp failed', e.message);
    }
    
    // Log event
    try {
      const Event = require('../models/Event');
      await Event.create({
        type: 'resource_created',
        user: req.user._id,
        meta: { resourceId: resource._id }
      });
    } catch(e) {
      console.error('log event failed', e.message);
    }
    
    // Evaluate badges
    try {
      const { evaluateAndAward } = require('../utils/badges');
      await evaluateAndAward(req.user._id);
    } catch(e) {
      console.error('badge eval failed', e.message);
    }
    
    res.status(201).json(resource);
  } catch (err) {
    console.error('resource create error', err.message);
    res.status(500).json({ message: 'Failed to create resource' });
  }
});

// remix (fork) a resource: create a copy credited to original
router.post('/:id/remix', auth, async (req, res) => {
  try {
    if (!isValidMongoId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid resource ID' });
    }
    
    const orig = await Resource.findById(req.params.id);
    if (!orig) {
      return res.status(404).json({ message: 'Original resource not found' });
    }
    
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
