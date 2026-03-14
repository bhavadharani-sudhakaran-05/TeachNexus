const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// get recent messages for a room
router.get('/:room', async (req, res) => {
  try {
    const { room } = req.params;
    const items = await Message.find({ room }).sort({ ts: 1 }).limit(200).lean();
    res.json(items);
  } catch (err) {
    console.error('chat history error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
