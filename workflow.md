# Student Management App Workflow

This document explains the project structure, request flow, database setup,
local development process, and deployment process.

## 1. Architecture

```text
frontend/   Browser interface
backend/    Express API and application logic
database/   PostgreSQL connection and table initialization
```

Required root configuration:

```text
api/index.js                    Vercel serverless entry point
vercel.json                     Vercel routes for frontend and API
.github/workflows/deploy.yml    GitHub Pages deployment workflow
package.json                    Root scripts and dependencies
README.md                       Setup and deployment guide
workflow.md                     Complete project workflow reference
```

## 2. Frontend files

| File | Responsibility |
| --- | --- |
| `frontend/index.html` | Application markup, forms, dashboard panels, and script loading order |
| `frontend/css/style.css` | Responsive layout, themes, forms, cards, and component styles |
| `frontend/js/config.js` | Chooses the API URL for localhost, Vercel, or GitHub Pages |
| `frontend/js/auth.js` | Registration, login, JWT storage, logout, and API requests |
| `frontend/js/app.js` | Startup, navigation, theme switching, and toast messages |
| `frontend/js/todos.js` | Todo loading, creation, completion, deletion, and rendering |
| `frontend/js/timetable.js` | Weekly timetable loading, creation, deletion, and rendering |
| `frontend/js/attendance.js` | Attendance subjects, calculations, and present/absent actions |
| `frontend/js/timer.js` | Pomodoro timer and completed focus-session logging |
| `frontend/js/chatbot.js` | Study assistant form and response rendering |
| `frontend/js/profile.js` | Profile statistics and JSON data export |

`frontend/index.html` loads `config.js`, the feature modules, and `app.js`.
`app.js` initializes every module after `DOMContentLoaded`.

## 3. Backend files

| File or folder | Responsibility |
| --- | --- |
| `backend/src/index.js` | Starts the local server on `PORT` |
| `backend/src/app.js` | Creates Express, loads environment variables, configures CORS and routes |
| `backend/src/middleware/auth.js` | Validates JWTs for protected routes |
| `backend/src/controllers/authController.js` | Registration, login, and profile endpoints |
| `backend/src/controllers/todoController.js` | Todo operations |
| `backend/src/controllers/timetableController.js` | Timetable operations |
| `backend/src/controllers/attendanceController.js` | Attendance operations |
| `backend/src/controllers/timerController.js` | Focus-session storage and statistics |
| `backend/src/controllers/chatbotController.js` | Public study assistant endpoint |
| `api/index.js` | Exports the Express app to Vercel |

Controllers use the shared database query function and do not access PostgreSQL
directly.

## 4. Database files and behavior

`database/db.js` owns persistence:

1. `DATABASE_URL` creates a PostgreSQL connection pool.
2. `initDB()` connects once and creates all tables with
   `CREATE TABLE IF NOT EXISTS`.
3. API queries wait for database initialization.
4. Without `DATABASE_URL`, a temporary in-memory fallback is used for local
   testing. It is cleared when the process stops.

Tables:

- `users`: account identity and password hashes.
- `todos`: user-owned tasks.
- `timetable`: user-owned class schedule entries.
- `attendance`: user-owned subjects and lecture counts.
- `timer_sessions`: completed focus sessions.

Use `backend/.env.example` as the local configuration template. Never commit
`.env` files, passwords, database URLs, or JWT secrets.

## 5. Request flow

### Registration

1. The user submits the registration form.
2. The frontend sends `POST /api/auth/register`.
3. The backend validates fields and normalizes the email.
4. The controller checks for an existing email.
5. `bcryptjs` hashes the password.
6. The database inserts the user.
7. The backend signs a seven-day JWT.
8. The frontend stores the JWT and user profile in `localStorage`.

### Protected request

1. The frontend reads the stored JWT.
2. `Auth.apiRequest()` sends `Authorization: Bearer <JWT>`.
3. The auth middleware verifies the token.
4. The controller receives `req.user.id`.
5. Database queries filter records by that user ID.
6. JSON is rendered by the frontend module.

## 6. Local development

From the repository root:

```bash
npm install
copy backend\.env.example backend\.env
npm start
```

Set a random `JWT_SECRET` with at least 32 characters. Add a PostgreSQL
`DATABASE_URL` for persistent local data. Without it, data is lost on restart.

Health check:

```text
http://localhost:3000/api/health
```

Serve `frontend/` with VS Code Live Server or another static server. On
localhost, the frontend automatically calls `http://localhost:3000/api`.

## 7. Deployment

### Vercel

1. Import the repository with the repository root as the project root.
2. Add `JWT_SECRET` with at least 32 random characters.
3. Add a persistent PostgreSQL `DATABASE_URL`.
4. Deploy.
5. `vercel.json` sends `/api/*` to `api/index.js` and browser files to
   `frontend/`.

### GitHub Pages

The GitHub Actions workflow runs on pushes to `main` and deploys `frontend/` to
the `gh-pages` branch. GitHub Pages uses the production API URL in
`frontend/js/config.js`.

## 8. API route map

| Method | Route | Auth |
| --- | --- | --- |
| GET | `/api/health` | Public |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | JWT |
| GET, POST | `/api/todos` | JWT |
| PATCH, DELETE | `/api/todos/:id...` | JWT |
| GET, POST | `/api/timetable` | JWT |
| DELETE | `/api/timetable/:id` | JWT |
| GET, POST | `/api/attendance` | JWT |
| PATCH, DELETE | `/api/attendance/:id...` | JWT |
| GET | `/api/timer/stats` | JWT |
| POST | `/api/timer/session` | JWT |
| POST | `/api/chatbot` | Public |

## 9. Validation checklist

```bash
node --check backend/src/app.js
node --check database/db.js
node --check frontend/js/auth.js
```

Then verify health, registration, login, one protected request, and PostgreSQL
connectivity before deploying.
