# TeachNexus - Teacher Collaboration Platform

A full-featured MERN (MongoDB, Express, React, Node.js) application for educators to collaborate, create lesson plans, share resources, and engage students through gamification and AI-powered tools.

## 🚀 Features

### Core Features

- ✅ **User Authentication** - Secure JWT-based login/registration
- ✅ **Resource Management** - Create, share, and remix lesson resources
- ✅ **AI Lesson Generator** - OpenAI integration for automatic lesson planning
- ✅ **Real-time Chat** - Socket.io powered messaging and collaboration
- ✅ **Gamification System** - XP, levels, leaderboards, badges
- ✅ **Badge Achievements** - Auto-evaluated achievement system
- ✅ **File Uploads** - Secure file storage with Cloudinary
- ✅ **Email Notifications** - Transactional emails with templates
- ✅ **Collaborative Editing** - Yjs WebSocket for real-time document editing
- ✅ **Analytics** - Event tracking and engagement metrics
- ✅ **Parent Portal** - Family access to student progress
- ✅ **Admin Dashboard** - Management tools and reporting

### Technical Features

- ✅ **Rate Limiting** - DDoS protection (100 req/15 min)
- ✅ **Input Validation** - Comprehensive validation utility
- ✅ **Error Handling** - Global error middleware and logging
- ✅ **CORS Security** - Production-ready CORS configuration
- ✅ **Database Indexing** - Optimized MongoDB queries
- ✅ **Docker Support** - Containerized deployment
- ✅ **Testing Suite** - Basic API test coverage
- ✅ **Health Check** - Endpoint monitoring ready

## 📁 Project Structure

```
TeachNexus/
├── backend/                    # Express.js API Server
│   ├── src/
│   │   ├── routes/            # 13 API endpoints
│   │   ├── models/            # 7 MongoDB schemas
│   │   ├── middleware/        # Auth, validation, errors
│   │   ├── utils/             # Gamification, badges, email
│   │   ├── sockets/           # WebSocket handlers
│   │   └── server.js          # Express app
│   ├── tests/                 # API test suite
│   ├── seeds/                 # Database initialization
│   ├── SETUP_GUIDE.md         # Detailed backend setup
│   └── package.json           # Dependencies
│
├── frontend/                   # React + Vite UI
│   ├── src/
│   │   ├── pages/             # 15+ page components
│   │   ├── components/        # Reusable UI components
│   │   ├── api.js             # API client
│   │   └── i18n.js            # Localization (EN/ES)
│   └── package.json           # Dependencies
│
├── API_DOCUMENTATION.md       # Complete API reference
├── DEPLOYMENT_CHECKLIST.md    # Production deployment guide
├── DEPLOYMENT_READY.md        # Build status
├── MONGODB_ATLAS_SETUP.md     # Database configuration
├── docker-compose.yml         # Local dev environment
└── README.md                  # This file
```

## 🔧 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env - at minimum set:
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/teachnexus
# JWT_SECRET=your_secret_key_here
npm run seed              # Initialize database
npm run dev               # Start server on port 5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev               # Start on port 5173
# Frontend will connect to http://localhost:5000
```

### 3. Test It Out

- Visit http://localhost:5173
- Register as a teacher
- Create a resource or lesson plan
- Generate an AI lesson
- View leaderboard
- Chat with other users

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get JWT token

### Resources

- `GET /api/resources` - List resources
- `POST /api/resources` - Create resource
- `POST /api/resources/:id/remix` - Remix resource

### Lesson Plans

- `GET /api/lessonplans` - List plans
- `POST /api/lessonplans` - Create plan

### Features

- `POST /api/ai/lesson` - Generate lesson with AI
- `POST /api/gamification/award` - Award XP points
- `GET /api/gamification/leaderboard` - Get rankings
- `GET /api/badges` - List available badges
- `GET /api/chat/:room` - Message history
- `GET /api/notifications` - User notifications
- `POST /api/uploads` - Upload files

**Complete API reference:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## ⚙️ Configuration

### Essential Environment Variables

```env
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/teachnexus

# Security
JWT_SECRET=your_secure_32_char_key_here

# OpenAI Integration
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini

# Email Notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Storage (Optional)
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# Server
PORT=5000
FRONTEND_URL=http://localhost:5173
WS_URL=http://localhost:5000
NODE_ENV=development
```

**Complete configuration guide:** [backend/SETUP_GUIDE.md](./backend/SETUP_GUIDE.md)

## 🚀 Deployment

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
# Starts MongoDB, Backend, and Frontend in dev mode
```

### Traditional Deployment

**Heroku:**

```bash
heroku create teachnexus-api
heroku config:set JWT_SECRET=... MONGO_URI=...
git push heroku main
```

**AWS/DigitalOcean:**
See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for step-by-step production deployment guide.

**Docker:**

```bash
# Backend
docker build -t teachnexus-api backend/
docker run -e MONGO_URI=... -p 5000:5000 teachnexus-api

# Frontend
docker build -t teachnexus-web frontend/
docker run -p 5173:5173 teachnexus-web
```

## 🧪 Testing

### Run API Tests

```bash
cd backend
npm test
```

Tests cover:

- User registration and login
- Resource creation and retrieval
- AI lesson generation
- Gamification (XP, leaderboard)
- Error handling and validation

## 📚 Documentation

| Document                                             | Purpose                                  |
| ---------------------------------------------------- | ---------------------------------------- |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)       | Complete API reference with examples     |
| [backend/SETUP_GUIDE.md](./backend/SETUP_GUIDE.md)   | Backend setup, configuration, deployment |
| [backend/README.md](./backend/README.md)             | Backend overview and development         |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Production deployment guide              |
| [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md)         | Build status and assets                  |
| [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)   | Database setup instructions              |

## 🛠️ Technology Stack

| Component          | Technology                    |
| ------------------ | ----------------------------- |
| **Frontend**       | React 18 + Vite + TailwindCSS |
| **Backend**        | Node.js + Express.js          |
| **Database**       | MongoDB + Mongoose            |
| **Authentication** | JWT + bcryptjs                |
| **Real-time**      | Socket.io + Yjs               |
| **File Storage**   | Cloudinary                    |
| **Email**          | Nodemailer                    |
| **AI**             | OpenAI API                    |
| **Localization**   | i18n (EN/ES)                  |

## 📦 Key Dependencies

**Backend:**

- express, mongoose, socket.io, jwt, bcryptjs
- axios (OpenAI), cloudinary, nodemailer, y-websocket

**Frontend:**

- react, react-router, socket.io-client
- i18next (translations)

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ Rate limiting (100 req/15 min per IP)
- ✅ Input validation and sanitization
- ✅ CORS with whitelisted origins
- ✅ SQL injection protection via Mongoose
- ✅ Environment variable isolation
- ✅ Secure password reset (email based)
- ✅ HTTPS/TLS ready
- ✅ Role-based access control

## 📊 Database Models

- **User** - Teachers, students, admins, parents
- **Resource** - Shareable lesson materials
- **LessonPlan** - Structured lesson outlines
- **Badge** - Achievement definitions
- **Event** - Activity tracking for analytics
- **Message** - Real-time chat messages
- **Notification** - User alerts and updates

## 🎯 Performance Metrics

- **API Response Time**: < 200ms (target)
- **Database Query**: < 50ms (optimized)
- **Bundle Size**: ~18.4 KB JavaScript
- **Rate Limit**: 100 requests per 15 minutes
- **Concurrent Users**: Scalable with load balancing

## 🐛 Troubleshooting

### MongoDB Connection Error

- Verify MONGO_URI is correct
- Check MongoDB is running (local) or cluster is active (Atlas)
- Whitelist IP address in MongoDB Atlas

### JWT Errors

- Ensure JWT_SECRET is set and consistent
- Token expires after 7 days by default
- Check Authorization header format: `Bearer <token>`

### Email Not Sending

- Enable "Less secure apps" for Gmail
- Use App Passwords instead of regular password
- Verify SMTP settings for your email provider

### Rate Limiting Issues

- Adjust limit in `backend/src/middleware/rateLimit.js`
- Default: 100 requests per 15 minutes per IP

See [backend/SETUP_GUIDE.md](./backend/SETUP_GUIDE.md#troubleshooting) for more solutions.

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push branch: `git push origin feature/your-feature`
4. Submit pull request

## 📝 License

MIT

## 💡 Next Steps

1. **Complete Backend Setup**
   - [ ] Set up MongoDB Atlas or local MongoDB
   - [ ] Copy and configure .env file
   - [ ] Run `npm run seed` for badge data
   - [ ] Start development server

2. **Complete Frontend Setup**
   - [ ] Configure API endpoints
   - [ ] Test all pages load correctly
   - [ ] Verify WebSocket connection

3. **Enable Features**
   - [ ] Set OpenAI API key for AI lessons
   - [ ] Configure Cloudinary for uploads
   - [ ] Set up email with your provider

4. **Deploy to Production**
   - [ ] Follow [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
   - [ ] Set up monitoring and logging
   - [ ] Configure backups

## 👥 Support & Resources

- **Backend Support**: See [backend/README.md](./backend/README.md)
- **Frontend Support**: See [frontend/README.md](./frontend/README.md)
- **API Docs**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Setup Help**: [backend/SETUP_GUIDE.md](./backend/SETUP_GUIDE.md)
- **Deployment**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

**Ready to run your first tests?** Start backend with `npm run dev` from the `backend/` folder!
