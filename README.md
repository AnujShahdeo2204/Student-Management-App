# Student Management App 🎓

A modern, full-stack application designed to help students organize their academic and personal lives. Track tasks, manage timetables, maintain focus with a Pomodoro timer, and view detailed statistics—all in a beautiful, responsive dark-mode enabled interface.

## 🌟 Features

- **✅ Task Management (Todos)**: Organize assignments and tasks by priority, category, and due date.
- **📅 Interactive Timetable**: Visual weekly schedule with color-coded classes and events.
- **⏱️ Focus Timer (Pomodoro)**: Built-in productivity timer for study sessions and breaks.
- **📊 Profile & Statistics**: View your completed tasks, focus hours, and export your data as JSON.
- **🌓 Dark Mode**: Seamlessly switch between light and dark themes.
- **🔒 Secure Authentication**: Real-time sign-in and sign-up with Email or Google (powered by Supabase).

## 🏗️ Architecture

This repository uses a monorepo structure:
- **`frontend/`**: A React application built with Vite, TypeScript, and Tailwind CSS.
- **`backend/`**: A Node.js Express server configured in TypeScript (ready for custom APIs or AI Chatbot logic).
- **`database/`**: Contains raw SQL migrations for the Supabase backend.

### Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router
- **Backend**: Node.js, Express, TypeScript
- **Database / Auth**: [Supabase](https://supabase.com/) (PostgreSQL + GoTrue Auth)

## 🚀 Local Development Setup

### 1. Supabase Setup (Database & Auth)
This project relies on Supabase for the database and authentication.
1. Create a free project on [Supabase](https://supabase.com/).
2. Navigate to **Project Settings -> API** and copy your `Project URL` and `anon public` key.
3. Open the **SQL Editor** in your Supabase dashboard and run the code from `database/supabase/migrations/all_migrations.sql` to generate your tables and security policies.

### 2. Frontend Setup
1. Open terminal and go to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Create an environment file:
   Create a `.env` file in the `frontend` folder and add your Supabase keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The app will run at `http://localhost:5173`.*

### 3. Backend Setup (Optional)
1. Open terminal and go to the backend directory:
   ```bash
   cd backend
   npm install
   ```
2. Run the Express API server:
   ```bash
   npm run dev
   ```
   *The API will run at `http://localhost:3000`.*

## 🌐 Live Demo
The application is live and deployed via GitHub Pages at:
👉 **[https://AnujShahdeo2204.github.io/Student-Management-App/](https://AnujShahdeo2204.github.io/Student-Management-App/)**

## 🚀 Deploying to GitHub Pages

This project is configured to automatically deploy to GitHub pages.

1. **Push your code to GitHub**:
   Make sure all your code (including this updated README) is pushed to your GitHub repository.
2. **Run the deploy command**:
   Open a terminal in the `frontend` folder and run:
   ```bash
   npm run deploy
   ```
   *(This will automatically bundle the application along with your `.env` variables and push it to the `gh-pages` branch).*
3. **Configure GitHub Settings**:
   - Go to your repository settings on GitHub.
   - Click on **Pages** in the left sidebar.
   - Ensure the Source is set to **Deploy from a branch** and the branch is set to `gh-pages`.

## 💡 Notes on "Fallback Mode"
If you run the frontend *without* a `.env` file, the app has a built-in safety net that boots into a "local mock session." It allows you to test the UI without a live database connection. Once you add real keys, it switches automatically to production mode.

---
*Built with ❤️ for modern students.*