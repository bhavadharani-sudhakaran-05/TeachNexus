# TeachNexus (MERN Starter)

This workspace contains a starter scaffold for TeachNexus — a MERN-based teacher collaboration platform.

Folders:

- `backend` — Express API, Mongoose models
- `frontend` — Vite + React landing UI (Tailwind via CDN)

Quick start

1. Start backend:

```bash
cd backend
npm install
# copy .env.example to .env and set MONGO_URI and JWT_SECRET
npm run dev
```

2. Start frontend:

```bash
cd frontend
npm install
npm run dev
```

Next recommended steps:

- Implement secure file uploads (Cloudinary or DigitalOcean Spaces) — `/api/uploads` added
- Add collaborative editor (Yjs) and Socket.io integration
- Integrate AI through an LLM provider from Node.js backend
