# Student Manager

Student Manager is a full-stack student organizer with a vanilla HTML/CSS/JavaScript frontend, an Express API, JWT authentication, and PostgreSQL persistence.

Live application: https://student-management-app-black.vercel.app/

## Features

- Email/password registration and login
- JWT-protected student sessions
- Task management with priority, category, due dates, completion, and deletion
- Weekly timetable with coloured class entries
- Attendance tracking with 75% rule guidance
- Pomodoro focus timer and study-session history
- Study assistant chatbot
- Profile statistics and JSON export
- Light/dark theme preference
- Responsive sage, cream, and olive frontend with gentle tab transitions
- Local storage for the theme and authentication session

## Architecture

```text
frontend/   Browser UI, styles, and feature modules
backend/    Express API, middleware, and controllers
database/   PostgreSQL connection, schema initialization, and fallback store
api/        Vercel serverless entry point
```

### Important files

| File | Purpose |
| --- | --- |
| `frontend/index.html` | Dashboard markup, forms, navigation, and script loading |
| `frontend/css/style.css` | Responsive layout, themes, cards, animation, and controls |
| `frontend/js/config.js` | Selects the API URL for local and deployed environments |
| `frontend/js/app.js` | Initializes modules, navigation, themes, and tab transitions |
| `frontend/js/auth.js` | Registration, login, JWT session handling, and API requests |
| `frontend/js/todos.js` | Task CRUD and Home task summary |
| `frontend/js/timetable.js` | Timetable CRUD and day filtering |
| `frontend/js/attendance.js` | Attendance subjects, calculations, and actions |
| `frontend/js/timer.js` | Pomodoro timer and session logging |
| `frontend/js/chatbot.js` | Study assistant interface |
| `frontend/js/profile.js` | Profile statistics and data export |
| `backend/src/app.js` | Express app, CORS, routes, and database startup |
| `backend/src/index.js` | Local server entry point |
| `backend/src/middleware/auth.js` | JWT validation middleware |
| `backend/src/controllers/` | API controller implementations |
| `database/db.js` | PostgreSQL pool, table creation, and local fallback |
| `api/index.js` | Exports the Express app for Vercel |
| `vercel.json` | Routes frontend files and `/api/*` requests |
| `workflow.md` | Detailed request, database, and deployment workflow |

## Local setup

### Requirements

- Node.js 18 or newer
- npm
- PostgreSQL for persistent local data, or no database for temporary local fallback

### Install and configure

```bash
npm install
copy backend\.env.example backend\.env
```

Edit `backend\.env`:

```env
JWT_SECRET=replace-with-a-random-secret-at-least-32-characters-long
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

Never commit `.env` files, passwords, database URLs, or JWT secrets.

### Run the API

```bash
npm start
```

The local API runs at `http://localhost:3000`.

Health check:

```text
http://localhost:3000/api/health
```

Serve the `frontend` folder with VS Code Live Server or another static server. When opened on localhost, the frontend automatically uses `http://localhost:3000/api`.

Without `DATABASE_URL`, the API uses an in-memory fallback. That fallback is intended only for local testing and is cleared when the server stops.

## API routes

Protected routes require an `Authorization: Bearer <token>` header.

| Method | Route | Access |
| --- | --- | --- |
| GET | `/api/health` | Public |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |
| GET, POST | `/api/todos` | Protected |
| PATCH | `/api/todos/:id/toggle` | Protected |
| DELETE | `/api/todos/:id` | Protected |
| GET, POST | `/api/timetable` | Protected |
| DELETE | `/api/timetable/:id` | Protected |
| GET, POST | `/api/attendance` | Protected |
| PATCH | `/api/attendance/:id/record` | Protected |
| DELETE | `/api/attendance/:id` | Protected |
| GET | `/api/timer/stats` | Protected |
| POST | `/api/timer/session` | Protected |
| POST | `/api/chatbot` | Public |

## Database

`database/db.js` creates these tables automatically:

- `users`
- `todos`
- `timetable`
- `attendance`
- `timer_sessions`

For production, use a persistent PostgreSQL provider such as Neon and set its connection string as the Vercel `DATABASE_URL` environment variable.

## Deployment

### Vercel

1. Import the GitHub repository into Vercel.
2. Keep the project root at the repository root.
3. Add these production environment variables:
   - `JWT_SECRET`
   - `DATABASE_URL`
4. Deploy.

`vercel.json` serves `frontend/` and rewrites `/api/*` to `api/index.js`.

### GitHub Pages

The GitHub Actions workflow in `.github/workflows/deploy.yml` deploys the `frontend` folder to GitHub Pages after pushes to `main`. GitHub Pages uses the production API URL configured in `frontend/js/config.js`.

## Validation

```bash
node --check backend/src/app.js
node --check database/db.js
node --check frontend/js/app.js
node --check frontend/js/auth.js
node --check frontend/js/todos.js
node --check frontend/js/timetable.js
node --check frontend/js/attendance.js
node --check frontend/js/timer.js
node --check frontend/js/chatbot.js
node --check frontend/js/profile.js
```

Before a production release, verify health, registration, login, one protected request, and PostgreSQL persistence.
