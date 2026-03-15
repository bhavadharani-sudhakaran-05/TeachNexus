const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Notification = require('../models/Notification')

// GET /api/notifications - user's notifications
router.get('/', auth, async (req, res) => {
  try {
    const items = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100)
    const unread = await Notification.countDocuments({ user: req.user._id, read: false })
    res.json({ items, unread })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/notifications/:id/read - mark read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const n = await Notification.findById(req.params.id)
    if (!n) return res.status(404).json({ message: 'Not found' })
    if (n.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' })
    n.read = true
    await n.save()
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/notifications/read-all - mark all notifications for user as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { $set: { read: true } })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
