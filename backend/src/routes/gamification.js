const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

function computeLevel(xp){
  // simple level curve: every 200 XP = new level
  return Math.floor(xp / 200) + 1
}

// Award XP to a user. Body: { userId?, amount, reason? }
router.post('/award', auth, async (req, res) => {
  try{
    const { userId, amount = 0 } = req.body
    const targetId = userId || req.user._id
    const user = await User.findById(targetId)
    if (!user) return res.status(404).json({ message: 'User not found' })
    user.xp = (user.xp || 0) + Number(amount)
    user.level = computeLevel(user.xp)
    await user.save()
    res.json({ ok: true, xp: user.xp, level: user.level })
  }catch(err){
    console.error('award xp error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Leaderboard
router.get('/leaderboard', async (req, res) => {
  try{
    const limit = Math.min(100, Number(req.query.limit) || 20)
    const top = await User.find().sort({ xp: -1 }).limit(limit).select('name school xp level badges')
    res.json({ leaderboard: top })
  }catch(err){
    console.error('leaderboard error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
