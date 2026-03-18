# TeachNexus - Backend API

Express.js + MongoDB backend for the TeachNexus teacher collaboration platform.

## Quick Start

### 1. Setup

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
```

### 2. Database Setup

```bash
# Seed initial data (badges, etc.)
npm run seed
```

### 3. Start Server

```bash
npm run dev        # Development with auto-reload
npm start          # Production
npm test           # Run tests
```

Server runs on **http://localhost:5000**

## Features

✅ **Authentication** - JWT-based registration & login  
✅ **User Management** - Profiles, roles, verification  
✅ **Resources** - Create, share, remix lesson resources  
✅ **Gamification** - XP, levels, leaderboards  
✅ **Badges** - Achievement system with auto-evaluation  
✅ **AI Lessons** - OpenAI integration for automatic lesson generation  
✅ **Real-time Chat** - Socket.io powered messaging  
✅ **Concurrent Editing** - Yjs websocket for collaborative docs  
✅ **File Uploads** - Cloudinary integration  
✅ **Email Notifications** - Nodemailer with templates  
✅ **Analytics** - Event tracking and engagement metrics  
✅ **Admin Portal** - Email template editor, user management

## Project Structure

```
backend/
├── src/
│   ├── routes/          # API endpoints (13 routes)
│   ├── models/          # MongoDB schemas (7 models)
│   ├── middleware/      # Auth, validation, error handling
│   ├── utils/           # Helpers (gamification, badges, email)
│   ├── sockets/         # WebSocket handlers
│   ├── templates/       # Email templates
│   └── server.js        # Express app entry point
├── tests/               # Test suite
├── seeds/               # Database initialization
├── .env.example         # Configuration template
├── SETUP_GUIDE.md       # Detailed setup instructions
└── package.json         # Dependencies
```

## API Endpoints

### Core Routes

- **Auth** - `/api/auth` (register, login)
- **Resources** - `/api/resources` (CRUD, remix)
- **Lesson Plans** - `/api/lessonplans` (create, list)
- **Chat** - `/api/chat` (message history)
- **Uploads** - `/api/uploads` (file handling)

### Feature Routes

- **AI** - `/api/ai` (lesson generation)
- **Gamification** - `/api/gamification` (XP, leaderboard)
- **Badges** - `/api/badges` (achievements)
- **Notifications** - `/api/notifications` (alerts)
- **Analytics** - `/api/analytics` (event tracking)
- **Parent Portal** - `/api/parents` (family access)
- **Admin** - `/api/admin/*` (management tools)

See [../API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for complete reference.

## Configuration

### Essential Variables

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/teachnexus
JWT_SECRET=your_secret_key_min_32_chars
OPENAI_API_KEY=sk-...
```

### Optional Variables

- **Email**: EMAIL_HOST, EMAIL_USER, EMAIL_PASS
- **Files**: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY
- **Server**: PORT, FRONTEND_URL

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete configuration reference.

## Development

### Running Tests

```bash
npm test
```

### Database Seeding

```bash
npm run seed
```

Creates initial badge definitions and sample data.

### Debugging

```bash
DEBUG=* npm run dev
```

## Production Deployment

### Heroku

```bash
heroku create teachnexus-api
heroku config:set JWT_SECRET=...
heroku config:set MONGO_URI=...
git push heroku main
```

### Docker

```bash
docker build -t teachnexus-api .
docker run -e MONGO_URI=... -p 5000:5000 teachnexus-api
```

### Security Checklist

- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up email authentication
- [ ] Enable rate limiting
- [ ] Use environment-specific configs
- [ ] Monitor error logs
- [ ] Regular database backups

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

## Technology Stack

| Layer              | Technology          |
| ------------------ | ------------------- |
| **Runtime**        | Node.js             |
| **Framework**      | Express.js          |
| **Database**       | MongoDB + Mongoose  |
| **Authentication** | JWT + bcryptjs      |
| **Real-time**      | Socket.io + Yjs     |
| **File Upload**    | Multer + Cloudinary |
| **Email**          | Nodemailer          |
| **AI**             | OpenAI API          |

## Key Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "socket.io": "^4.7.2",
  "cloudinary": "^1.32.0",
  "nodemailer": "^6.9.4",
  "axios": "^1.4.0"
}
```

## Common Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm start            # Start production server
npm test             # Run test suite
npm run seed         # Initialize database
```

## Error Handling

All errors return consistent JSON format:

```json
{
  "message": "Error description",
  "errors": ["Specific error 1"]
}
```

**Status codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limited
- `500` - Server Error

## Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Configurable** in `src/middleware/rateLimit.js`
- **Returns**: 429 Too Many Requests

## Support & Documentation

- **API Docs**: [../API_DOCUMENTATION.md](../API_DOCUMENTATION.md)
- **Setup Guide**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Root README**: [../README.md](../README.md)

## License

MIT
