const User = require('../models/User')

function computeLevel(xp){
  return Math.floor(xp / 200) + 1
}

async function awardXp(userId, amount){
  if (!userId) return null
  const user = await User.findById(userId)
  if (!user) return null
  user.xp = (user.xp || 0) + Number(amount)
  user.level = computeLevel(user.xp)
  await user.save()
  // after xp change, attempt to evaluate badges for this user
  try {
    const { evaluateAndAward } = require('./badges')
    const awarded = await evaluateAndAward(user._id)
    if (awarded && awarded.length) {
      // optionally notify or log — Event logging is handled by evaluateAndAward
      console.log('awarded badges', awarded)
    }
  } catch (e) {
    // don't block XP awarding on badge evaluation
    console.error('badge eval failed', e)
  }
  return user
}

module.exports = { awardXp, computeLevel }
