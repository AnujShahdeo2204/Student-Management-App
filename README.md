# Student Management App ÃƒÂ°Ã…Â¸Ã…Â½Ã¢â‚¬Å“

A modern, full-stack student organizer built with an **easy-to-understand, beginner-friendly tech stack** and **self-made Email/Password authentication** (completely free of Google, Supabase, or third-party auth dependencies).

Designed to run as a static site on **GitHub Pages** and as a combined static/serverless deployment on **Vercel**.

---

## ÃƒÂ°Ã…Â¸Ã…â€™Ã…Â¸ Features

- **ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ¢â‚¬â„¢ Self-Made Authentication**: Custom Email & Password sign-up, login, and secure sessions via JWT tokens and bcrypt password hashing.
- **ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Task Management (Todos)**: Organize assignments and tasks by priority, category, and due date with instant status updates and completion progress.
- **ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬Â¦ Interactive Weekly Timetable**: Color-coded weekly class schedule with room and time slots.
- **ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…Â  75% Rule Attendance Tracker**: Track attended and total lectures per subject with smart safe-to-miss and must-attend advice alerts.
- **ÃƒÂ¢Ã‚ÂÃ‚Â±ÃƒÂ¯Ã‚Â¸Ã‚Â Focus Timer (Pomodoro)**: 25-minute study intervals, short and long breaks with completion audio chimes and study session logging.
- **ÃƒÂ°Ã…Â¸Ã‚Â¤Ã¢â‚¬â€œ Student AI Assistant**: Instant study tips, attendance strategies, and schedule advice.
- **ÃƒÂ°Ã…Â¸Ã¢â‚¬ËœÃ‚Â¤ Profile & Data Export**: Summary statistics of your academic productivity with 1-click JSON backup export.
- **ÃƒÂ°Ã…Â¸Ã…â€™Ã¢â‚¬Å“ Dark Mode**: Built-in dark and light theme toggle with local memory persistence.

---

## ÃƒÂ°Ã…Â¸Ã‚ÂÃ¢â‚¬â€ÃƒÂ¯Ã‚Â¸Ã‚Â Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Vanilla HTML5, CSS3, JavaScript (ES6+)** | Zero build step, runs immediately in any browser without `npm install` or bundlers. |
| **Backend** | **Node.js + Express.js** | REST API and serverless handler for **Vercel**. |
| **Auth** | **JWT (`jsonwebtoken`) + `bcryptjs`** | Self-made token authentication with password hashing (no Google/Supabase). |
| **Database** | **PostgreSQL (via Neon.tech)** | Serverless cloud PostgreSQL with auto-table initialization and a zero-setup local memory fallback. |
| **Frontend Hosting** | **GitHub Pages** | Free static hosting via the GitHub Actions workflow. |
| **Backend Hosting** | **Vercel** | Free global serverless hosting with automatic HTTPS and instant deploys. |

---

## ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Â» Local Development Setup

### 1. Configure the database and authentication

The API uses PostgreSQL in production and creates all required tables automatically
when it starts. Copy `backend/.env.example` to `backend/.env` and set:

```env
JWT_SECRET=use-a-random-secret-at-least-32-characters-long
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

`DATABASE_URL` is optional for local UI testing; without it, data is stored in
memory and is lost when the server restarts. For a working deployed app, set both
variables in the Vercel project settings before deploying.

### 2. Start the Backend API

```bash
npm install
npm start
```
*The server will start at `http://localhost:3000` with the `/api/health` status check.*

### 3. Open the Frontend

Use a local static server from the repository root (for example, VS Code Live
Server) and open `frontend/index.html`. The frontend automatically uses the
local API on `localhost` and the same-origin API on Vercel. GitHub Pages uses
the production API URL in `frontend/js/config.js`.

---

## ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¡ API Endpoints Reference

All endpoints accept and return JSON. Protected endpoints require a valid JWT authorization header.
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Health status check |
| `POST` | `/api/auth/register` | Public | Register new student (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Login with `email` and `password` (returns JWT) |
| `GET` | `/api/auth/me` | Protected | Fetch current logged-in student profile |
| `GET` | `/api/todos` | Protected | Get all tasks for the logged-in student |
| `POST` | `/api/todos` | Protected | Create new task (`title`, `category`, `priority`, `due_date`) |
| `PATCH` | `/api/todos/:id/toggle` | Protected | Toggle task completed state (`completed: true/false`) |
| `DELETE` | `/api/todos/:id` | Protected | Delete task |
| `GET` | `/api/timetable` | Protected | Get weekly schedule slots |
| `POST` | `/api/timetable` | Protected | Add schedule slot (`day`, `subject`, `time_start`, `time_end`, `room`, `color`) |
| `DELETE` | `/api/timetable/:id` | Protected | Remove schedule slot |
| `GET` | `/api/attendance` | Protected | Get attendance subjects & stats |
| `POST` | `/api/attendance` | Protected | Add subject (`subject`, `attended`, `total`, `target_percentage`) |
| `PATCH` | `/api/attendance/:id/record` | Protected | Record attendance (`action: 'present' \| 'absent' \| 'reset'`) |
| `DELETE` | `/api/attendance/:id` | Protected | Delete subject |
| `GET` | `/api/timer/stats` | Protected | Get total focus hours, session history, and counts |
| `POST` | `/api/timer/session` | Protected | Log completed Pomodoro session (`duration_minutes`, `session_type`) |
| `POST` | `/api/chatbot` | Public | Study assistant chat endpoint (`message`) |

---

## ÃƒÂ°Ã…Â¸Ã¢â‚¬â€Ã¢â‚¬Å¾ÃƒÂ¯Ã‚Â¸Ã‚Â Database Tables

When connected to PostgreSQL, tables are created automatically on boot by
[`database/db.js`](./database/db.js):

- **`users`**: `id`, `name`, `email`, `password_hash`, `created_at`
- **`todos`**: `id`, `user_id`, `title`, `category`, `priority`, `due_date`, `completed`, `created_at`
- **`timetable`**: `id`, `user_id`, `day`, `subject`, `time_start`, `time_end`, `room`, `color`, `created_at`
- **`attendance`**: `id`, `user_id`, `subject`, `attended`, `total`, `target_percentage`, `created_at`
- **`timer_sessions`**: `id`, `user_id`, `duration_minutes`, `session_type`, `completed_at`

---

## ÃƒÂ°Ã…Â¸Ã…Â¡Ã¢â€šÂ¬ Deployment Guide

### A. Deploy Backend to Vercel (Free)

1. **Push your code to GitHub**:
   ```bash
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your **`Student-Management-App`** repository.
4. Keep the **Root Directory** at the repository root. Vercel serves
   `frontend/` and deploys `api/index.js` as the `/api/*` serverless function.
5. Add Environment Variables in the Vercel Dashboard:
   - `JWT_SECRET`: A random secret of at least 32 characters.
   - `DATABASE_URL`: *(Optional but recommended)* Your free PostgreSQL connection string from [Neon.tech](https://neon.tech). If omitted, the server operates on local fallback.
6. Click **Deploy**. Vercel will give you a live HTTPS URL like:
   `https://your-student-app.vercel.app`

---

### B. Deploy Frontend to GitHub Pages (Free)

1. Open your repository on GitHub.
2. Go to **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment**:
   - **Source**: Select **Deploy from a branch**.
   - **Branch**: Select `gh-pages` and folder `/ (root)`.
   - Click **Save**.
4. GitHub Pages will publish your site at:
   `https://<your-username>.github.io/Student-Management-App/`

---

### C. Connect Frontend to Live Backend

The Vercel frontend uses its same-origin `/api` route. The GitHub Pages frontend
uses the production API URL in `frontend/js/config.js`.

---

## ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â Repository Structure

```
ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ backend/                    # Express API
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ src/
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ controllers/         # Auth, Todos, Timetable, Attendance, Timer, Chatbot
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ middleware/          # JWT Verification Middleware
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ app.js               # Express application configuration
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ index.js             # Local development server entry point
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ .env.example             # Environment variable template
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡
ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ database/                    # PostgreSQL connection and schema initialization
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ db.js
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡
ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ frontend/                   # Pure HTML, CSS, JavaScript (No build required!)
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ css/
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ style.css            # Responsive layout & theme variables
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ js/
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ config.js            # API base URL configuration
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ auth.js              # Self-made Email/Password JWT auth
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ todos.js             # Tasks CRUD & filters
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ timetable.js         # Weekly schedule & day selector
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ attendance.js        # 75% rule tracker & advice
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ timer.js             # Pomodoro focus timer with audio tone
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ chatbot.js           # Student assistant chat stream
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ profile.js           # Statistics & JSON backup export
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ app.js               # Main tab coordinator & toasts
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ index.html               # Main application markup
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡
ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ api/index.js                # Vercel serverless entry point
ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ .github/workflows/deploy.yml # GitHub Pages deployment
ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ package.json                # Root scripts and dependencies
ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ workflow.md                 # Complete project workflow reference
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ vercel.json                 # Static frontend and API rewrites
```

---

*Built with ÃƒÂ¢Ã‚ÂÃ‚Â¤ÃƒÂ¯Ã‚Â¸Ã‚Â for modern students.*
