const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')
const Badge = require('../models/Badge')
const Event = require('../models/Event')

// list available badge definitions (admin) or user's badges
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const all = await Badge.find().sort({ createdAt: 1 })
      return res.json({ badges: all })
    }
    // return user's badges
    const user = await User.findById(req.user._id).select('badges')
    res.json({ badges: user.badges || [] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// admin: create badge rule
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
    const { key, title, description, criteria } = req.body
    if (!key || !title || !criteria) return res.status(400).json({ message: 'Missing fields' })
    const b = await Badge.create({ key, title, description, criteria })
    res.json({ badge: b })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// evaluate and award badges for a user (id optional — defaults to current user)
router.post('/evaluate', auth, async (req, res) => {
  try {
    const uid = req.body.userId || req.user._id
    const { evaluateAndAward } = require('../utils/badges')
    const awarded = await evaluateAndAward(uid)
    const user = await User.findById(uid).select('badges')
    res.json({ awarded, badges: user.badges })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
