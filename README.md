# Global Student Connect (MERN Stack)

Global Student Connect is a collaborative platform built on the MERN stack (MongoDB, Express, React with Vite, Node.js) designed to connect students across the globe for cross-cultural video discussions, shared study sessions, and peer feedback.

---

## 👥 Team Ownership Matrix

To keep development simple and avoid Git merge conflicts across the 5-person team, responsibilities are organized by layer and feature domain:

| Member | Focus Area | Owned Paths | Core Responsibilities |
| :--- | :--- | :--- | :--- |
| **Member 1 (Tech Lead)** | Auth & User Core | `backend/controllers/auth*`, `backend/models/User.js`, `frontend/src/components/*Auth*` | User authentication, JWT sessions, user profiles & login/signup UI |
| **Member 2** | Video & Rooms | `backend/controllers/session*`, `backend/models/Session.js`, `frontend/src/pages/Video*` | WebRTC / video calling, virtual rooms & session scheduling |
| **Member 3** | Matching & Discovery | `backend/controllers/match*`, `backend/models/Match.js`, `frontend/src/components/*Match*` | Matchmaking algorithm, interest filtering & peer discovery cards |
| **Member 4** | Reflections & Safety | `backend/controllers/reflection*`, `backend/models/Reflection.js`, `frontend/src/pages/Reflection*` | Post-session reflections, peer feedback forms & safety reports |
| **Member 5** | Core Infrastructure | `backend/config/`, `backend/middleware/`, `backend/routes/`, `frontend/src/pages/Dashboard*` | Database connection, auth/error middleware, routing & dashboard |

---

## 🚀 Quickstart Guide

### 1. Initial Setup
```bash
# Option A: Run automated setup script
chmod +x init-repo.sh
./init-repo.sh

# Option B: Install dependencies manually across the monorepo
npm run install:all
```

### 2. Environment Configuration
Verify your backend `.env` file (copied automatically from `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/global_student_connect
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Running in Development
Start both Express backend (`http://localhost:5000`) and Vite React frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Individual service commands:
- `npm run server` — Runs backend with auto-reload (`node --watch server.js`)
- `npm run client` — Runs Vite development server
- `npm run build` — Builds frontend production bundle

---

## 📁 Clean Repository Structure

```
Global-Student-Connect/
├── .gitignore
├── package.json               # Root monorepo orchestrator (concurrently)
├── README.md                  # Team ownership & onboarding guide
├── init-repo.sh               # Shell bootstrap script
│
├── frontend/                  # React + Vite (Port 5173)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx           # Vite React client entry
│       ├── App.jsx            # Starter client screen
│       ├── components/        # Reusable UI widgets (cards, modals, forms)
│       └── pages/             # Route-level views (Dashboard, VideoRoom, Reflection)
│
└── backend/                   # Express + Mongoose (Port 5000)
    ├── package.json           # ES Module ("type": "module")
    ├── .env.example
    ├── server.js              # Express entry point
    ├── config/                # Database connection & env config
    │   └── db.js
    ├── controllers/           # Route controller handlers
    ├── middleware/            # Auth verification, error handling
    ├── models/                # Mongoose database schemas
    │   ├── User.js            # User profiles & preferences
    │   ├── Match.js           # Match requests & compatibility
    │   ├── Session.js         # Video rooms & scheduled times
    │   ├── Reflection.js      # Feedback & safety reports
    │   └── index.js
    └── routes/                # Express API route endpoints
```

---

## 🌿 Git Workflow Rules
1. **Branching**: Branch off `main` using feature branches: `feature/<member>-<task-name>` (e.g., `feature/m1-auth-ui`, `feature/m2-video-call`).
2. **Pull Requests**: Pull the latest `main` before submitting a PR and request review from at least one teammate.
