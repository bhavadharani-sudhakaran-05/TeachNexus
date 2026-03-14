const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role: role || 'teacher' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    // award small XP for joining
    try { const { awardXp } = require('../utils/gamify'); await awardXp(user._id, 10) } catch(e){ console.error('award xp failed', e) }
    // analytics: user registered
    try { const Event = require('../models/Event'); await Event.create({ type: 'user_registered', user: user._id }) } catch(e) { console.error('log event failed', e) }
    // evaluate badges on registration
    try { const { evaluateAndAward } = require('../utils/badges'); await evaluateAndAward(user._id) } catch(e){ console.error('badge eval failed', e) }
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
