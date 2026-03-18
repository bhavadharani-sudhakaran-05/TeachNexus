# TeachNexus - Production Deployment Checklist

## Pre-Deployment

### Security

- [ ] Change `JWT_SECRET` to a cryptographically secure random string (min 32 chars)
- [ ] Change `MONGO_URI` to production database
- [ ] Change database password from default
- [ ] Enable MongoDB authentication
- [ ] Configure CORS to only allow production frontend domain
- [ ] Set `FRONTEND_URL` to production domain
- [ ] Enable HTTPS/TLS on server
- [ ] Add security headers middleware (if needed)
- [ ] Review all API keys are from production/staging accounts
- [ ] Remove debug/verbose logging from production config

### Database

- [ ] Create production MongoDB cluster
- [ ] Set up automated backups
- [ ] Create database indexes for performance
- [ ] Test database connection from server
- [ ] Run `npm run seed` to initialize badges
- [ ] Verify database available from server IP

### Email Configuration

- [ ] Configure SMTP credentials for production email service
- [ ] Test email delivery
- [ ] Set up email reply-to address
- [ ] Enable SPF, DKIM for email domain
- [ ] Add unsubscribe links to emails

### File Storage

- [ ] Configure Cloudinary account credentials
- [ ] Set up upload folder structure
- [ ] Enable virus scanning (if available)
- [ ] Configure upload size limits
- [ ] Test file upload functionality

### AI Services

- [ ] Get OpenAI API key for production account
- [ ] Set appropriate rate limits and quotas
- [ ] Test lesson generation endpoint
- [ ] Monitor API costs

### Frontend

- [ ] Build frontend optimized production bundle
- [ ] Update API endpoint URLs in frontend config
- [ ] Update WebSocket URL in frontend
- [ ] Test all frontend-to-API connections
- [ ] Update application title/branding

### Infrastructure

- [ ] Choose hosting platform (Heroku, AWS, Azure, DigitalOcean, etc.)
- [ ] Configure domain name and DNS
- [ ] Set up SSL/TLS certificate
- [ ] Configure firewall rules
- [ ] Set up load balancer (if needed)
- [ ] Configure CDN for static assets (if needed)

### Monitoring & Logging

- [ ] Set up error logging service (Sentry, DataDog, CloudWatch)
- [ ] Configure performance monitoring
- [ ] Set up log aggregation
- [ ] Configure alerts for errors/downtime
- [ ] Test alert notifications
- [ ] Set up uptime monitoring

### Testing

- [ ] Run full test suite
- [ ] Test authentication flow
- [ ] Test file uploads
- [ ] Test email notifications
- [ ] Test API rate limiting
- [ ] Test with production data clone
- [ ] Load test critical endpoints
- [ ] Test graceful shutdown
- [ ] Test database failover (if applicable)

---

## Deployment

### Pre-Launch (Day Before)

- [ ] Create backup of all configurations
- [ ] Document all environment variables used
- [ ] Test deployment process in staging
- [ ] Verify rollback procedure works
- [ ] Get team approval on deployment

### Deployment Process

1. Build application

   ```bash
   npm install --production
   npm run seed  # Initialize database if fresh
   ```

2. Start service

   ```bash
   npm start
   # OR using PM2:
   pm2 start src/server.js --name "teachnexus-api"
   pm2 save
   ```

3. Verify health check

   ```bash
   curl https://api.teachnexus.com/api/health
   ```

4. Test critical flows
   - [ ] Register new user
   - [ ] Login
   - [ ] Create resource
   - [ ] Generate AI lesson
   - [ ] Upload file
   - [ ] Send notification

### Post-Deployment

- [ ] Monitor error logs for issues
- [ ] Check response times
- [ ] Verify database connections working
- [ ] Test email delivery
- [ ] Monitor API rate limiting
- [ ] Check file uploads working
- [ ] Verify AI endpoints responding

---

## Post-Deployment

### Day 1

- [ ] Monitor logs continuously
- [ ] Check for any error spikes
- [ ] Verify all notifications sending
- [ ] Test real-time features (chat, notifications)
- [ ] Monitor database performance
- [ ] Check API response times
- [ ] Verify scheduled tasks running

### Week 1

- [ ] Review server resource usage
- [ ] Check backup processes running
- [ ] Analyze error logs for patterns
- [ ] Review user feedback
- [ ] Performance optimize if needed
- [ ] Update documentation with production URLs

### Ongoing

- [ ] Daily: Check health endpoint
- [ ] Daily: Monitor error logs
- [ ] Weekly: Review performance metrics
- [ ] Weekly: Check database backup completion
- [ ] Monthly: Security audit
- [ ] Monthly: Performance optimization review
- [ ] Quarterly: Update dependencies
- [ ] Quarterly: Security penetration test

---

## Rollback Plan

If critical issues discovered:

1. **Immediate**: Disable problem endpoint or feature
2. **Fast**: Revert to previous version

   ```bash
   # Using git
   git revert HEAD
   npm install
   npm start

   # Using Docker
   docker run <previous-image-tag>

   # Using PM2
   pm2 restart teachnexus-api
   ```

3. **Verify**: Run health checks and critical tests
4. **Communicate**: Notify users if needed
5. **Investigate**: Debug the issue
6. **Retest**: Thoroughly test fix before deploying again

---

## Environment Variables Reference

### Required

```env
MONGO_URI=mongodb+srv://[CHANGE_ME]@cluster.mongodb.net/teachnexus
JWT_SECRET=[CHANGE_ME_TO_32_CHAR_SECURE_STRING]
```

### Recommended

```env
PORT=5000
FRONTEND_URL=https://teachnexus.com
NODE_ENV=production
LOG_LEVEL=info  # or: error, warn, info
```

### Optional but Useful

```env
OPENAI_API_KEY=[your_key]
CLOUDINARY_CLOUD_NAME=[your_name]
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=[your_email]
EMAIL_PASS=[your_app_password]
SENTRY_DSN=[error_tracking_url]
```

---

## Performance Targets

Aim for these metrics in production:

- **API Response Time**: < 200ms (p95)
- **Database Query**: < 50ms (p95)
- **Error Rate**: < 0.1%
- **Uptime**: 99.9%+
- **CPU Usage**: < 70%
- **Memory Usage**: < 60%
- **Database Connections**: < 50% of limit

---

## Documentation

After deployment, update these files:

1. **API_DOCUMENTATION.md** - Add production URL
2. **SETUP_GUIDE.md** - Add production deployment section
3. **README.md** - Add production badge/status
4. **Runbook** - Create team runbook for common issues

---

## Support Contacts

Document these before deployment:

- [ ] On-call engineer contact
- [ ] Database administrator contact
- [ ] Security team contact
- [ ] Escalation contacts
- [ ] Customer support template

---

## Post-Launch Review (Week 2)

Schedule a meeting to review:

- Overall stability and performance
- Any issues encountered
- User feedback
- Resource utilization
- Cost analysis
- Improvement opportunities

Document findings and create improvement backlog.
