const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., resource_created, lesson_created, chat_message
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  meta: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
