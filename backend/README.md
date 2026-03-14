# TeachNexus - Backend

Simple Express + MongoDB starter for TeachNexus.

## Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run in dev:

```bash
npm run dev
```

API endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/resources`
- `POST /api/resources`
