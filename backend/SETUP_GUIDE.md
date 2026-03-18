# TeachNexus Backend - Setup & Deployment Guide

## Quick Start (Development)

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- npm

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update these critical values:

```bash
cp .env.example .env
```

**Essential Configuration:**

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/teachnexus

# Security - CHANGE THESE
JWT_SECRET=your_secure_random_string_min_32_chars

# OpenAI (for AI features)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Email (for notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 3. Seed Database

Initialize badge definitions and sample data:

```bash
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## MongoDB Setup

### Option A: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB: `mongod`
3. Use URI: `mongodb://127.0.0.1:27017/teachnexus`

### Option B: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free M0 cluster
3. Create database user and get connection string
4. Use format: `mongodb+srv://username:password@cluster.mongodb.net/teachnexus?retryWrites=true&w=majority`

---

## Environment Variables Reference

| Variable              | Required | Description                    | Example                 |
| --------------------- | -------- | ------------------------------ | ----------------------- |
| MONGO_URI             | Yes      | Database connection string     | `mongodb+srv://...`     |
| JWT_SECRET            | Yes      | JWT signing key (min 32 chars) | `your_secure_key_here`  |
| PORT                  | No       | Server port                    | `5000`                  |
| OPENAI_API_KEY        | No       | OpenAI API key for AI lessons  | `sk-...`                |
| OPENAI_MODEL          | No       | OpenAI model                   | `gpt-4o-mini`           |
| CLOUDINARY_CLOUD_NAME | No       | File upload service            | `your_account`          |
| CLOUDINARY_API_KEY    | No       | Cloudinary key                 | `...`                   |
| CLOUDINARY_API_SECRET | No       | Cloudinary secret              | `...`                   |
| EMAIL_HOST            | No       | SMTP host                      | `smtp.gmail.com`        |
| EMAIL_PORT            | No       | SMTP port                      | `587`                   |
| EMAIL_USER            | No       | Email account                  | `your_email@gmail.com`  |
| EMAIL_PASS            | No       | Email password/app-password    | `...`                   |
| EMAIL_FROM            | No       | Sender display name            | `TeachNexus`            |
| FRONTEND_URL          | No       | Frontend origin for CORS       | `http://localhost:5173` |
| WS_URL                | No       | WebSocket URL for client       | `http://localhost:5000` |

---

## API Testing

### Using npm test

```bash
npm test
```

This runs the basic test suite against a running server.

### Using curl

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get resources
curl http://localhost:5000/api/resources
```

See [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for complete API reference.

---

## Production Deployment

### Security Checklist

- [ ] Change `JWT_SECRET` to a long, random string
- [ ] Use strong database passwords
- [ ] Enable HTTPS/TLS
- [ ] Set `FRONTEND_URL` to your actual domain
- [ ] Configure email with verified sender
- [ ] Enable rate limiting (already added)
- [ ] Use environment-specific configurations
- [ ] Rotate API keys regularly
- [ ] Enable MongoDB authentication
- [ ] Set up error logging (Sentry, DataDog, etc.)

### Deploy to Heroku

```bash
heroku create teachnexus-api
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGO_URI=your_connection_string
git push heroku main
```

### Deploy to AWS EC2

1. Create Ubuntu 22.04 instance
2. Install Node.js and MongoDB
3. Clone repository
4. Set environment variables in `.env`
5. Start with PM2:

```bash
npm install -g pm2
pm2 start src/server.js --name "teachnexus"
pm2 save && pm2 startup
```

### Deploy to Docker

```bash
docker build -t teachnexus-api .
docker run -e MONGO_URI=... -e JWT_SECRET=... -p 5000:5000 teachnexus-api
```

### Deploy to Railway / Render / Fly.io

1. Connect repository
2. Set environment variables
3. Configure build step: `npm install && npm run seed`
4. Set start command: `npm start`

---

## Monitoring & Logging

### View Logs (Development)

```bash
# With nodemon
npm run dev

# Check logs in terminal
```

### Production Monitoring

Set up monitoring for:

- API response times
- Error rates
- Database query performance
- Memory usage
- Disk space

Recommended tools:

- **Sentry** - Error tracking
- **New Relic** - APM
- **DataDog** - Infrastructure monitoring
- **CloudWatch** (AWS) - Logs and metrics

---

## Troubleshooting

### MongoDB Connection Error

```
Failed to connect to MongoDB
```

- Verify MONGO_URI is correct
- Check MongoDB is running (local) or cluster is active (Atlas)
- Verify firewall/security group allows connection
- Check IP whitelist (for Atlas)

### JWT Errors

```
Invalid token / Token expired
```

- Ensure JWT_SECRET is set and consistent
- Token expires after 7 days (configurable)
- Client must send token in `Authorization: Bearer <token>` header

### Email Not Sending

```
sendBadgeEmail failed
```

- Enable "Less secure app access" for Gmail
- Use App Passwords instead of regular password
- Verify EMAIL_USER and EMAIL_PASS are correct
- Check SMTP settings for your provider

### Port Already in Use

```
Error: listen EADDRINUSE :::5000
```

- Change PORT in .env
- Or kill process: `lsof -ti:5000 | xargs kill -9`

### Rate Limiting Too Strict

Edit `src/middleware/rateLimit.js`:

```javascript
app.use(initRateLimiter(15 * 60 * 1000, 200)); // Increase to 200 requests
```

---

## Performance Optimization

### Database Indexes

Ensure these indexes exist:

```javascript
// Email index (unique)
User.collection.createIndex({ email: 1 }, { unique: true });

// Resource search
Resource.collection.createIndex({ subject: 1, grade: 1, isPublic: 1 });
```

### Caching Strategy

- Cache badge definitions in memory
- Cache popular resources
- Use Redis for session storage (optional)

### Query Optimization

All routes use:

- `.limit()` for pagination
- `.select()` to limit fields
- `.lean()` for read-only queries
- Proper MongoDB indexes

---

## Backup & Recovery

### MongoDB Backup

```bash
# Backup
mongodump --uri="mongodb+srv://..." --out=/backup/teachnexus

# Restore
mongorestore --uri="mongodb+srv://..." /backup/teachnexus
```

### Automatic Backups

Enable in MongoDB Atlas:
Settings → Backup & Restore → Configure continuous backups

---

## Support & Resources

- **API Docs**: [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)
- **MongoDB**: https://docs.mongodb.com/
- **Express**: https://expressjs.com/
- **OpenAI**: https://platform.openai.com/docs/
- **Socket.io**: https://socket.io/docs/

---

## Next Steps

- [ ] Complete environment configuration
- [ ] Set up MongoDB database
- [ ] Run `npm run seed` for initial data
- [ ] Start development server: `npm run dev`
- [ ] Test endpoints via curl or API client
- [ ] Connect frontend and verify end-to-end
- [ ] Deploy to production
- [ ] Set up monitoring and logging
