# MongoDB Atlas with TeachNexus Frontend

## Backend Configuration
- Backend `.env` configured for MongoDB Atlas
- All 10+ routes connected in server.js:
  - /api/auth (Authentication)
  - /api/resources (Resource library)
  - /api/chat (Chat & messaging)
  - /api/uploads (File uploads)
  - /api/ai (AI tools)
  - /api/lessonplans (Lesson planning)
  - /api/verify (Plagiarism/verification)
  - /api/gamification (Gamification system)
  - /api/parents (Parent portal)
  - /api/analytics (Admin analytics)
  - /api/badges (Badge system)
  - /api/notifications (Notifications)
  - /api/admin/templates (Email templates)

## MongoDB Atlas Setup Instructions

1. **Create/Log in to MongoDB Atlas:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free account or log in

2. **Create a Cluster:**
   - Click "Create a Deployment"
   - Choose "M0 Free" tier
   - Select your region (closest to your users)
   - Click "Create Deployment"

3. **Create Database User:**
   - In the cluster page, go to "Database Access"
   - Click "Add New Database User"
   - Username: `teachnexus_user`
   - Password: Generate a strong password
   - Click "Create User"

4. **Get Connection String:**
   - Go to "Clusters" → "Connect"
   - Choose "Drivers" → select Node.js version 4.x (latest)
   - Copy the connection string

5. **Update .env in backend folder:**
   Replace the MONGO_URI with your connection string:
   ```
   MONGO_URI=mongodb+srv://teachnexus_user:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/teachnexus?retryWrites=true&w=majority
   ```

6. **Database Name:**
   - MongoDB Atlas will auto-create "teachnexus" database
   - All collections will be created by Mongoose on first use

## Restart Backend Server

```powershell
cd D:\TeachNexus\backend
npm run dev
```

All routes should now connect to MongoDB Atlas.
