require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const chatRoutes = require('./routes/chat');
const uploadRoutes = require('./routes/uploads');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/teachnexus';
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: '*' } });
    // expose io to notifier util
    try {
      const notifier = require('./utils/notifier')
      notifier.setIO(io)
    } catch (e) {
      console.warn('notifier init failed', e)
    }

    // initialize socket handlers
    require('./sockets/chat')(io);

    // initialize Yjs websocket server for collaborative documents
    try {
      require('./sockets/yjs')(server);
    } catch (e) {
      console.warn('Failed to start Yjs websocket:', e.message || e);
    }

    // API route for chat history
    app.use('/api/chat', chatRoutes);
    // File uploads
    app.use('/api/uploads', uploadRoutes);
    // AI endpoints
    const aiRoutes = require('./routes/ai');
    app.use('/api/ai', aiRoutes);
    // Lesson plan endpoints
    const lessonPlanRoutes = require('./routes/lessonplans');
    app.use('/api/lessonplans', lessonPlanRoutes);
    // Verification / plagiarism API
    const verifyRoutes = require('./routes/verify');
    app.use('/api/verify', verifyRoutes);
    // Gamification
    const gamifyRoutes = require('./routes/gamification');
    app.use('/api/gamification', gamifyRoutes);
    // Parent portal
    const parentsRoutes = require('./routes/parents');
    app.use('/api/parents', parentsRoutes);
    // Analytics / admin reports
    const analyticsRoutes = require('./routes/analytics');
    app.use('/api/analytics', analyticsRoutes);
    // Badges automation
    const badgesRoutes = require('./routes/badges');
    app.use('/api/badges', badgesRoutes);
    // Notifications
    const notificationsRoutes = require('./routes/notifications');
    app.use('/api/notifications', notificationsRoutes);
    // Admin email templates editor
    const emailTemplates = require('./routes/emailTemplates');
    app.use('/api/admin/templates', emailTemplates);

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
