# Global Student Connect (MERN Stack)

Global Student Connect is a collaborative platform built on the MERN stack (MongoDB, Express, React with Vite, Node.js) designed to connect students across the globe for cross-cultural video discussions, shared study sessions, and peer feedback.

---

## 👥 Team Roles & Ownership Matrix

This team matrix aligns directly with our official division of labor to ensure seamless collaboration and prevent Git merge conflicts:

| Member | Responsibility | Main Work | Primary Code Paths / Files |
| :--- | :--- | :--- | :--- |
| **1. Frontend** | **Student UI** | Login, profile, dashboard, matching screens | `frontend/src/pages/` (`Login.jsx`, `Profile.jsx`, `Dashboard.jsx`, `Matching.jsx`), `frontend/src/components/` (Auth & Profile UI) |
| **2. Frontend** | **Video/Interaction UI** | Video-call page, chat, topic/question interface | `frontend/src/pages/` (`VideoCall.jsx`, `Chat.jsx`), `frontend/src/components/` (Video player, Chat box, Topic prompt widgets) |
| **3. Backend** | **Authentication & Profiles** | APIs, login/signup, student profiles | `backend/models/User.js`, `backend/controllers/auth*`, `backend/routes/auth*`, `backend/middleware/auth*` |
| **4. Backend** | **Matching & Scheduling** | Matching algorithm, database, meeting scheduling | `backend/models/Match.js`, `backend/models/Session.js`, `backend/models/Reflection.js`, `backend/controllers/match*`, `backend/controllers/session*` |
| **5. Integration/AI** | **AI + DevOps** | AI-assisted matching/topic suggestions, API integration, deployment, testing | `backend/controllers/ai*`, `backend/routes/ai*`, Docker/CI deployment configs, cross-service integration & automated tests |

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

## 📁 Repository Structure

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
│       ├── App.jsx            # Starter client dashboard with team matrix
│       ├── components/        # [Members 1 & 2] Reusable UI widgets (cards, chat, video controls)
│       └── pages/             # [Members 1 & 2] Route-level views (Login, Profile, Video, Matching)
│
└── backend/                   # Express + Mongoose (Port 5000)
    ├── package.json           # ES Module ("type": "module")
    ├── .env.example
    ├── server.js              # Express entry point
    ├── config/                # Database connection & env config
    │   └── db.js
    ├── controllers/           # [Members 3, 4, 5] Route controller handlers (auth, match, session, ai)
    ├── middleware/            # [Members 3 & 5] Auth verification, error handling
    ├── models/                # [Members 3 & 4] Mongoose database schemas
    │   ├── User.js            # [Member 3] User profiles & credentials
    │   ├── Match.js           # [Member 4] Match pairings & compatibility
    │   ├── Session.js         # [Member 4] Meeting rooms & schedules
    │   ├── Reflection.js      # [Member 4] Post-session feedback & reports
    │   └── index.js
    └── routes/                # [Members 3, 4, 5] Express API routes (auth, match, session, ai)
```

---

## 🌿 Git Workflow Rules
1. **Branching**: Branch off `main` using feature branches: `feature/<member>-<task-name>` (e.g., `feature/m1-student-login`, `feature/m2-video-call`, `feature/m3-auth-api`, `feature/m4-matching-algo`, `feature/m5-ai-topics`).
2. **Pull Requests**: Pull the latest `main` before submitting a PR and request review from at least one teammate.
