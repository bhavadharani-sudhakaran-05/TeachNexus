const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

module.exports = function(io){
  io.on('connection', (socket) => {
    try {
      const token = socket.handshake.auth?.token || null;
      let user = { id: null, name: 'Anonymous' };
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
          user = { id: decoded.id, name: decoded.name || 'User' };
        } catch (e) {
          // invalid token - proceed as anonymous
        }
      }

      socket.data.user = user;
      // if authenticated, join a personal room for targeted notifications
      if (socket.data.user && socket.data.user.id) {
        socket.join(`user:${socket.data.user.id}`)
      }
      console.log('socket connected', socket.id, 'user', user.id || 'anon');

      // join default global room
      socket.join('global');
      io.to('global').emit('presence', { user: user, status: 'joined' });

      socket.on('join_room', async (room) => {
        socket.join(room);
        io.to(room).emit('presence', { user: socket.data.user, status: 'joined', room });

        // send recent history to the joining socket
        try {
          const history = await Message.find({ room }).sort({ ts: 1 }).limit(200).lean();
          socket.emit('history', history);
        } catch (e) {
          console.error('failed to load history', e);
        }
      });

      socket.on('leave_room', (room) => {
        socket.leave(room);
        io.to(room).emit('presence', { user: socket.data.user, status: 'left', room });
      });

      socket.on('message', async ({ room = 'global', text }) => {
        const payload = {
          user: socket.data.user,
          text,
          ts: Date.now()
        };

        // persist message
        try {
          const m = await Message.create({ room, user: socket.data.user.id || null, username: socket.data.user.name || 'Anonymous', text, ts: payload.ts });
          payload._id = m._id;
          // analytics: log chat message event
          try { const Event = require('../models/Event'); await Event.create({ type: 'chat_message', user: socket.data.user.id || null, meta: { room, messageId: m._id } }) } catch(e){ console.error('log event failed', e) }
        } catch (e) {
          console.error('failed to save message', e);
        }

        io.to(room).emit('message', payload);
      });

      socket.on('disconnect', () => {
        console.log('socket disconnect', socket.id);
        io.to('global').emit('presence', { user: socket.data.user, status: 'left' });
      });
    } catch (err) {
      console.error('socket error', err);
    }
  });
};
