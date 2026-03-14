const mongoose = require('mongoose');

const LessonPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  objectives: [String],
  activities: [
    {
      title: String,
      durationMinutes: Number,
      description: String
    }
  ],
  grade: String,
  subject: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LessonPlan', LessonPlanSchema);
