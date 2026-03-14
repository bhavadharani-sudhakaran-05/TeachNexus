const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'admin', 'principal', 'parent'], default: 'teacher' },
  subject: String,
  gradeLevels: [String],
  school: String,
  bio: String,
  badges: [String],
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  // Parent/child relationships: parent users hold references to child user accounts
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
