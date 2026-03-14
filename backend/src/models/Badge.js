const mongoose = require('mongoose')

const BadgeSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  criteria: { type: Object }, // e.g., { xp: 500 } or { resourceCount: 10 }
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Badge', BadgeSchema)
