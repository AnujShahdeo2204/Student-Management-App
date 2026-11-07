# Student Management App 🎓

A modern, fast, full-stack application designed to help students organize tasks, class timetables, attendance tracking, and study focus sessions—built with an **easy-to-understand tech stack** and **self-made Email/Password authentication** (zero reliance on Google or third-party auth).

---

## 🌟 Features

- **🔒 Self-Made Authentication**: Custom Email & Password sign-up, login, and secure sessions via JWT tokens and bcrypt password hashing.
- **✅ Task Management (Todos)**: Organize assignments and tasks by priority, category, and due date with instant status updates.
- **📅 Interactive Weekly Timetable**: Color-coded weekly class schedule with room and time slots.
- **📊 75% Rule Attendance Tracker**: Track attended and total lectures per subject with smart safe-to-miss and must-attend advice alerts.
- **⏱️ Focus Timer (Pomodoro)**: 25-minute study intervals, short and long breaks with completion chimes and study session logging.
- **🤖 Student AI Assistant**: Instant study tips, attendance strategies, and schedule advice.
- **👤 Profile & Data Export**: Summary statistics of your academic productivity with 1-click JSON backup export.
- **🌓 Dark Mode**: Built-in dark and light theme toggle with local memory persistence.

---

## 🏗️ Tech Stack

- **Frontend**: **Vanilla HTML5, CSS3, JavaScript (ES6+)**
  - Zero build step, no Webpack/Vite complexity.
  - Can be opened directly in the browser or served statically.
  - Deployable directly to **GitHub Pages**.
- **Backend**: **Node.js + Express.js**
  - Formatted for Serverless execution on **Vercel** (`api/index.js` + `vercel.json`).
  - Passwords hashed using `bcryptjs`.
  - Sessions secured using `jsonwebtoken` (JWT).
- **Database**: **PostgreSQL** (e.g. Free [Neon.tech](https://neon.tech) serverless Postgres) with automatic table creation, plus a zero-setup local memory fallback.

---

## 💻 Local Development

### 1. Start the Backend Server

```bash
cd backend
npm install
npm start
```
*The server will start at `http://localhost:3000` with the `/api/health` status check.*

### 2. Open the Frontend

Simply open `frontend/index.html` in your web browser (or use VS Code "Live Server").
The frontend will automatically connect to `http://localhost:3000/api`.

---

## 🚀 Deployment Guide

### A. Deploy Backend to Vercel

1. **Push your code to GitHub**.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Set the **Root Directory** to `backend` (or leave as root, as `vercel.json` is configured).
5. Add Environment Variables in the Vercel Dashboard:
   - `JWT_SECRET`: Any random secure string (e.g., `super_secret_student_key_2026`).
   - `DATABASE_URL`: Your free PostgreSQL connection string from [Neon.tech](https://neon.tech) (e.g., `postgresql://user:pass@ep-cool-flower.us-east-2.aws.neon.tech/neondb?sslmode=require`).
6. Click **Deploy**. Vercel will give you a live HTTPS URL like:
   `https://your-student-backend.vercel.app`

---

### B. Deploy Frontend to GitHub Pages

1. Go to your GitHub repository on GitHub.com.
2. Click **Settings** > **Pages** in the left sidebar.
3. Under **Build and deployment**:
   - **Source**: Select **Deploy from a branch**.
   - **Branch**: Select `main` and folder `/docs`.
   - Click **Save**.
4. GitHub Pages will build and deploy your site at:
   `https://<your-username>.github.io/<repo-name>/`

---

### C. Connect Frontend to Live Backend

Once your backend is live on Vercel:
1. Open your GitHub Pages website.
2. In the navigation bar, go to the **Profile** tab.
3. Under **⚙️ Backend Server URL**, paste your Vercel backend URL:
   `https://your-student-backend.vercel.app/api`
4. Click **Save URL**. That's it! Your GitHub Pages frontend is now permanently connected to your Vercel backend.

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
│   └── package.json
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
└── .github/workflows/deploy.yml # Optional automated GitHub Actions Pages deployment
```
