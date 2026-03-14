const Badge = require('../models/Badge')
const User = require('../models/User')
const Event = require('../models/Event')

async function evaluateAndAward(userId){
  if (!userId) return []
  const user = await User.findById(userId)
  if (!user) return []

  const badges = await Badge.find()
  const awarded = []

  for (const b of badges){
    if ((user.badges || []).includes(b.key)) continue
    const crit = b.criteria || {}
    let pass = true
    if (crit.xp) pass = pass && ((user.xp || 0) >= Number(crit.xp))
    if (crit.resourceCount){
      const rc = await Event.countDocuments({ type: 'resource_created', user: userId })
      pass = pass && (rc >= Number(crit.resourceCount))
    }
    if (crit.lessonCount){
      const lc = await Event.countDocuments({ type: 'lesson_created', user: userId })
      pass = pass && (lc >= Number(crit.lessonCount))
    }
    if (pass){
      user.badges = user.badges || []
      user.badges.push(b.key)
      awarded.push(b.key)
      // log badge awarded event
      try { await Event.create({ type: 'badge_awarded', user: userId, meta: { badge: b.key } }) } catch(e){ console.error('badge event log failed', e) }
      // persist a user notification
      try {
        const Notification = require('../models/Notification')
        await Notification.create({ user: userId, type: 'badge_awarded', title: `Badge: ${b.title}`, body: b.description || `You earned the ${b.title} badge`, meta: { badge: b.key } })
      } catch (e) {
        console.error('notification persist failed', e)
      }
    }
  }

  if (awarded.length) await user.save()
  // notify user via socket if available
  try {
    const notifier = require('./notifier')
    if (awarded.length) notifier.notifyUser(userId, { type: 'badge_awarded', badges: awarded })
  } catch (e) {
    console.error('notify user failed', e)
  }

  return awarded
}

module.exports = { evaluateAndAward }
