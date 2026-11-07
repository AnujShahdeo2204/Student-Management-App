# Student Management App 🎓

A modern, full-stack student organizer built with an **easy-to-understand, beginner-friendly tech stack** and **self-made Email/Password authentication** (completely free of Google, Supabase, or third-party auth dependencies).

Designed to run statically on **GitHub Pages** (frontend) and serverless on **Vercel** (backend API).

---

## 🌟 Features

- **🔒 Self-Made Authentication**: Custom Email & Password sign-up, login, and secure sessions via JWT tokens and bcrypt password hashing.
- **✅ Task Management (Todos)**: Organize assignments and tasks by priority, category, and due date with instant status updates and completion progress.
- **📅 Interactive Weekly Timetable**: Color-coded weekly class schedule with room and time slots.
- **📊 75% Rule Attendance Tracker**: Track attended and total lectures per subject with smart safe-to-miss and must-attend advice alerts.
- **⏱️ Focus Timer (Pomodoro)**: 25-minute study intervals, short and long breaks with completion audio chimes and study session logging.
- **🤖 Student AI Assistant**: Instant study tips, attendance strategies, and schedule advice.
- **👤 Profile & Data Export**: Summary statistics of your academic productivity with 1-click JSON backup export.
- **🌓 Dark Mode**: Built-in dark and light theme toggle with local memory persistence.

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Vanilla HTML5, CSS3, JavaScript (ES6+)** | Zero build step, runs immediately in any browser without `npm install` or bundlers. |
| **Backend** | **Node.js + Express.js** | Serverless REST API configured for **Vercel** (`api/index.js` + `vercel.json`). |
| **Auth** | **JWT (`jsonwebtoken`) + `bcryptjs`** | Self-made token authentication with password hashing (no Google/Supabase). |
| **Database** | **PostgreSQL (via Neon.tech)** | Serverless cloud PostgreSQL with auto-table initialization and a zero-setup local memory fallback. |
| **Frontend Hosting** | **GitHub Pages** | Free static hosting via the `/docs` folder or GitHub Actions workflow. |
| **Backend Hosting** | **Vercel** | Free global serverless hosting with automatic HTTPS and instant deploys. |

---

## 💻 Local Development Setup

### 1. Start the Backend API

```bash
cd backend
npm install
npm start
```
*The server will start at `http://localhost:3000` with the `/api/health` status check.*

### 2. Open the Frontend

Simply double-click or open `frontend/index.html` in your browser (or use VS Code "Live Server").
The frontend automatically detects `localhost` and communicates with `http://localhost:3000/api`.

---

## 📡 API Endpoints Reference

All endpoints accept and return JSON. Authenticated endpoints require the header `Authorization: Bearer <token>`.

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

## 🗄️ Database Tables

When connected to PostgreSQL, tables are created automatically on boot:

- **`users`**: `id`, `name`, `email`, `password_hash`, `created_at`
- **`todos`**: `id`, `user_id`, `title`, `category`, `priority`, `due_date`, `completed`, `created_at`
- **`timetable`**: `id`, `user_id`, `day`, `subject`, `time_start`, `time_end`, `room`, `color`, `created_at`
- **`attendance`**: `id`, `user_id`, `subject`, `attended`, `total`, `target_percentage`, `created_at`
- **`timer_sessions`**: `id`, `user_id`, `duration_minutes`, `session_type`, `completed_at`

---

## 🚀 Deployment Guide

### A. Deploy Backend to Vercel (Free)

1. **Push your code to GitHub**:
   ```bash
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your **`Student-Management-App`** repository.
4. Set the **Root Directory** to `backend` (or leave default root, as `vercel.json` is configured).
5. Add Environment Variables in the Vercel Dashboard:
   - `JWT_SECRET`: Any secret string (e.g., `student_app_secret_2026`).
   - `DATABASE_URL`: *(Optional but recommended)* Your free PostgreSQL connection string from [Neon.tech](https://neon.tech). If omitted, the server operates on local fallback.
6. Click **Deploy**. Vercel will give you a live HTTPS URL like:
   `https://your-student-backend.vercel.app`

---

### B. Deploy Frontend to GitHub Pages (Free)

1. Open your repository on GitHub.
2. Go to **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment**:
   - **Source**: Select **Deploy from a branch**.
   - **Branch**: Select `main` and folder `/docs`.
   - Click **Save**.
4. GitHub Pages will publish your site at:
   `https://<your-username>.github.io/Student-Management-App/`

---

### C. Connect Frontend to Live Backend

Once your backend is live on Vercel:
1. Open your live GitHub Pages website in your browser.
2. Navigate to the **Profile** tab.
3. Under **⚙️ Backend Server URL**, paste your Vercel backend URL:
   `https://your-student-backend.vercel.app/api`
4. Click **Save URL**.
*Your GitHub Pages frontend is now permanently connected to your Vercel backend.*

---

## 📁 Repository Structure

```
├── backend/
│   ├── api/
│   │   └── index.js             # Vercel Serverless Function entry point
│   ├── src/
│   │   ├── controllers/         # Auth, Todos, Timetable, Attendance, Timer, Chatbot
│   │   ├── middleware/          # JWT Verification Middleware
│   │   ├── db.js                # PostgreSQL connection pool & auto-table initialization
│   │   ├── app.js               # Express application configuration
│   │   └── index.js             # Local development server entry point
│   ├── vercel.json              # Vercel routing configuration
│   ├── package.json
│   └── .env.example
│
├── frontend/                    # Pure HTML, CSS, JavaScript (No build required!)
│   ├── css/
│   │   └── style.css            # Responsive layout & theme variables
│   ├── js/
│   │   ├── config.js            # API base URL configuration
│   │   ├── auth.js              # Self-made Email/Password JWT auth
│   │   ├── todos.js             # Tasks CRUD & filters
│   │   ├── timetable.js         # Weekly schedule & day selector
│   │   ├── attendance.js        # 75% rule tracker & advice
│   │   ├── timer.js             # Pomodoro focus timer with audio tone
│   │   ├── chatbot.js           # Student assistant chat stream
│   │   ├── profile.js           # Statistics & JSON backup export
│   │   └── app.js               # Main tab coordinator & toasts
│   └── index.html               # Main application markup
│
├── docs/                        # Direct mirror of frontend/ for 1-click GitHub Pages
├── .github/workflows/deploy.yml # Automated GitHub Actions Pages deployment
├── index.html                   # Root fallback redirect
└── vercel.json                  # Root Vercel rewrite configuration
```

---

*Built with ❤️ for modern students.*
