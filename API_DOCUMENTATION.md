# TeachNexus API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register

Create a new user account.

**POST** `/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "teacher" // optional: teacher, student, parent, admin
}
```

**Response:** (201)

```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "teacher"
  }
}
```

**Error:** (400, 409)

- Missing required fields
- Email already registered

---

### Login

Authenticate and get JWT token.

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** (200)

```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "teacher"
  }
}
```

**Error:** (400, 401)

- Invalid credentials
- Invalid email format

---

## Resources Endpoints

### List Resources

Get public resources with optional filters.

**GET** `/resources?subject=math&grade=5&q=fractions&limit=50&skip=0`

**Query Parameters:**

- `subject` (string): math, english, science, history, pe, art, music, social, computer
- `grade` (string): k, 1-12
- `q` (string): search term
- `limit` (number): max 100, default 50
- `skip` (number): for pagination, default 0

**Response:** (200)

```json
{
  "items": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Fractions Basics",
      "subject": "math",
      "grade": "5",
      "description": "Introduction to fractions",
      "author": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Smith",
        "school": "Lincoln High"
      },
      "isPublic": true,
      "createdAt": "2026-03-18T10:00:00Z"
    }
  ],
  "count": 1
}
```

---

### Get Single Resource

**GET** `/resources/:id`

**Response:** (200) Same as above

**Error:** (404)

- Resource not found

---

### Create Resource

**POST** `/resources`
_Requires authentication_

**Request Body:**

```json
{
  "title": "Fractions Basics",
  "subject": "math",
  "grade": "5",
  "description": "Introduction to fractions",
  "fileUrl": "https://...",
  "isPublic": true
}
```

**Response:** (201)

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Fractions Basics",
  "subject": "math",
  "grade": "5",
  "description": "Introduction to fractions",
  "author": "507f1f77bcf86cd799439012",
  "createdAt": "2026-03-18T10:00:00Z"
}
```

**Error:** (400)

- Validation failed (missing title, subject, grade)

---

### Remix Resource

Create a copy of an existing resource.

**POST** `/resources/:id/remix`
_Requires authentication_

**Response:** (201)
New resource with `remixedFrom` field set to original ID.

---

## Lesson Plans Endpoints

### List Lesson Plans

**GET** `/lessonplans`

**Response:** (200)

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Lesson on Photosynthesis",
    "objectives": ["Learn photosynthesis", "Understand chlorophyll"],
    "activities": [
      {
        "title": "Starter",
        "durationMinutes": 5,
        "description": "Quick warm-up"
      }
    ],
    "author": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith"
    },
    "createdAt": "2026-03-18T10:00:00Z"
  }
]
```

---

### Create Lesson Plan

**POST** `/lessonplans`
_Requires authentication_

**Request Body:**

```json
{
  "title": "Photosynthesis",
  "objectives": ["Learn photosynthesis", "Understand chlorophyll"],
  "activities": [
    {
      "title": "Starter",
      "durationMinutes": 5,
      "description": "Warm-up discussion"
    },
    {
      "title": "Main",
      "durationMinutes": 25,
      "description": "Hands-on experiment"
    }
  ]
}
```

---

## AI Endpoints

### Generate Lesson Plan

**POST** `/ai/lesson`

**Request Body:**

```json
{
  "topic": "Photosynthesis",
  "grade": "6",
  "duration": 45,
  "extra": "Optional extension activity"
}
```

**Response:** (200)

```json
{
  "source": "openai",
  "plan": {
    "title": "Photosynthesis — 6 (45 min)",
    "objectives": ["Understand photosynthesis", "Learn about chlorophyll"],
    "activities": [
      {
        "title": "Starter",
        "durationMinutes": 7,
        "description": "Quick warm-up on Photosynthesis"
      }
    ],
    "grade": "6",
    "subject": "Photosynthesis"
  }
}
```

---

## Gamification Endpoints

### Award XP

**POST** `/gamification/award`
_Requires authentication_

**Request Body:**

```json
{
  "amount": 50,
  "userId": "507f1f77bcf86cd799439011" // optional
}
```

**Response:** (200)

```json
{
  "ok": true,
  "xp": 150,
  "level": 1
}
```

---

### Get Leaderboard

**GET** `/gamification/leaderboard?limit=20`

**Query Parameters:**

- `limit` (number): default 20, max 100

**Response:** (200)

```json
{
  "leaderboard": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "school": "Lincoln High",
      "xp": 500,
      "level": 3,
      "badges": ["first_resource", "resource_creator"]
    }
  ]
}
```

---

## Badges Endpoints

### List Badges

**GET** `/badges`
_Requires authentication_

- Admins see all badge definitions
- Regular users see their own badges

**Response:** (200)

```json
{
  "badges": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "key": "first_resource",
      "title": "Resource Creator",
      "description": "Created your first resource",
      "criteria": [{ "type": "resource_created", "minCount": 1 }]
    }
  ]
}
```

---

### Evaluate Badges

**POST** `/badges/evaluate`
_Requires authentication_

Evaluate and award badges for the current user.

**Response:** (200)

```json
{
  "awarded": ["first_resource"],
  "total": 1
}
```

---

## Chat Endpoints

### Get Chat History

**GET** `/chat/:room`

**Response:** (200)

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "room": "class_5a",
    "user": "507f1f77bcf86cd799439012",
    "text": "Hello everyone!",
    "ts": "2026-03-18T10:00:00Z"
  }
]
```

---

## Notifications Endpoints

### Get Notifications

**GET** `/notifications`
_Requires authentication_

**Response:** (200)

```json
{
  "items": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user": "507f1f77bcf86cd799439012",
      "message": "You earned a badge!",
      "type": "badge",
      "read": false,
      "createdAt": "2026-03-18T10:00:00Z"
    }
  ],
  "unread": 3
}
```

---

### Mark Notification as Read

**PUT** `/notifications/:id/read`
_Requires authentication_

**Response:** (200)

```json
{
  "ok": true
}
```

---

### Mark All as Read

**PUT** `/notifications/read-all`
_Requires authentication_

**Response:** (200)

```json
{
  "ok": true
}
```

---

## File Upload Endpoints

### Upload File

**POST** `/uploads`
_Requires authentication_

**Request:** multipart/form-data

- `file` (File): The file to upload

**Response:** (200)

```json
{
  "url": "https://res.cloudinary.com/...",
  "filename": "document.pdf",
  "mimeType": "application/pdf",
  "providerId": "teachnexus/document_xyz"
}
```

---

## Analytics Endpoints

### Log Event

**POST** `/analytics/log`
_Requires authentication_

**Request Body:**

```json
{
  "type": "resource_viewed",
  "meta": {
    "resourceId": "507f1f77bcf86cd799439011"
  }
}
```

**Response:** (200)

```json
{
  "event": {
    "_id": "507f1f77bcf86cd799439011",
    "type": "resource_viewed",
    "user": "507f1f77bcf86cd799439012",
    "meta": { "resourceId": "507f1f77bcf86cd799439011" },
    "createdAt": "2026-03-18T10:00:00Z"
  }
}
```

---

### Analytics Summary

**GET** `/analytics/summary?days=7`
_Requires admin or principal role_

**Query Parameters:**

- `days` (number): default 7

**Response:** (200)

```json
{
  "totalEvents": 150,
  "byType": [
    { "_id": "resource_created", "count": 45 },
    { "_id": "user_registered", "count": 12 }
  ],
  "activeUsers": 28
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "message": "Error description",
  "errors": ["Specific error 1", "Specific error 2"] // optional
}
```

**Common HTTP Status Codes:**

- `200` OK
- `201` Created
- `400` Bad Request (validation error)
- `401` Unauthorized (missing/invalid token)
- `403` Forbidden (insufficient permissions)
- `404` Not Found
- `409` Conflict (duplicate email, etc)
- `429` Too Many Requests (rate limit exceeded)
- `500` Internal Server Error

---

## Rate Limiting

API is rate-limited to **100 requests per 15 minutes** per IP address.

When limit exceeded:

```
Status: 429
{
  "message": "Too many requests, please try again later"
}
```

---

## WebSocket Events

Real-time chat and notifications via Socket.IO:

### Listen for Messages

```javascript
socket.on("message", (data) => {
  console.log(data.user, data.text);
});
```

### Send Message

```javascript
socket.emit("message", { room: "class_5a", text: "Hello!" });
```

### Listen for Notifications

```javascript
socket.on("notification", (data) => {
  console.log(data.message);
});
```
