const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  room: { type: String, required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  username: { type: String },
  text: { type: String, required: true },
  ts: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
