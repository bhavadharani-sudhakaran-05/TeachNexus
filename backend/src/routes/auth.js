const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isValidEmail, isValidPassword, isValidName, isValidRole, sanitizeString } = require('../utils/validators');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validation
    if (!name || !isValidName(name)) {
      return res.status(400).json({ message: 'name is required and must be 1-100 characters' });
    }
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: 'email is required and must be valid' });
    }
    if (!password || !isValidPassword(password)) {
      return res.status(400).json({ message: 'password must be at least 6 characters' });
    }
    
    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedRole = isValidRole(role) ? role.toLowerCase() : 'teacher';
    
    // Check if email already exists
    const existing = await User.findOne({ email: sanitizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    // Hash password
    const hash = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      name: sanitizedName,
      email: sanitizedEmail,
      password: hash,
      role: sanitizedRole
    });
    
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    
    // Award XP for joining
    try {
      const { awardXp } = require('../utils/gamify');
      await awardXp(user._id, 10);
    } catch(e) {
      console.error('award xp failed', e.message);
    }
    
    // Log event
    try {
      const Event = require('../models/Event');
      await Event.create({ type: 'user_registered', user: user._id });
    } catch(e) {
      console.error('log event failed', e.message);
    }
    
    // Evaluate badges
    try {
      const { evaluateAndAward } = require('../utils/badges');
      await evaluateAndAward(user._id);
    } catch(e) {
      console.error('badge eval failed', e.message);
    }
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('register error', err.message);
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    const sanitizedEmail = email.toLowerCase().trim();
    
    // Find user
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('login error', err.message);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
