const express = require('express')
const LessonPlan = require('../models/LessonPlan')
const auth = require('../middleware/auth')

const router = express.Router()

// list lesson plans (recent)
router.get('/', async (req, res) => {
  try {
    const items = await LessonPlan.find().sort({ createdAt: -1 }).limit(50).populate('author', 'name')
    res.json(items)
  } catch (err) {
    console.error('lessonplans list error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// create a lesson plan (requires auth)
router.post('/', auth, async (req, res) => {
  try {
    const payload = req.body
    payload.author = req.user._id
    const lp = await LessonPlan.create(payload)
    // award XP for creating a lesson plan
    try { const { awardXp } = require('../utils/gamify'); await awardXp(req.user._id, 40) } catch(e){ console.error('award xp failed', e) }
    // analytics
    try { const Event = require('../models/Event'); await Event.create({ type: 'lesson_created', user: req.user._id, meta: { lessonId: lp._id } }) } catch(e){ console.error('log event failed', e) }
    // evaluate badges for the creator
    try { const { evaluateAndAward } = require('../utils/badges'); await evaluateAndAward(req.user._id) } catch(e){ console.error('badge eval failed', e) }
    res.json(lp)
  } catch (err) {
    console.error('lessonplans create error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
