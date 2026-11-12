const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { initDB } = require('../../database/db');
const { requireAuth } = require('./middleware/auth');
const authController = require('./controllers/authController');
const todoController = require('./controllers/todoController');
const timetableController = require('./controllers/timetableController');
const attendanceController = require('./controllers/attendanceController');
const timerController = require('./controllers/timerController');
const chatbotController = require('./controllers/chatbotController');

// Initialize database connection
initDB();

const app = express();

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        origin === 'https://anujshahdeo2204.github.io' ||
        /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin) ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error('Origin is not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());

// Public health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Student Management API',
    timestamp: new Date().toISOString(),
  });
});

// Authentication endpoints (Self-made, NO Google / Third-party)
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', requireAuth, authController.getMe);

// Todo routes (Protected)
app.get('/api/todos', requireAuth, todoController.getTodos);
app.post('/api/todos', requireAuth, todoController.createTodo);
app.patch('/api/todos/:id/toggle', requireAuth, todoController.toggleTodo);
app.delete('/api/todos/:id', requireAuth, todoController.deleteTodo);

// Timetable routes (Protected)
app.get('/api/timetable', requireAuth, timetableController.getTimetable);
app.post('/api/timetable', requireAuth, timetableController.createTimetableSlot);
app.delete('/api/timetable/:id', requireAuth, timetableController.deleteTimetableSlot);

// Attendance routes (Protected)
app.get('/api/attendance', requireAuth, attendanceController.getAttendance);
app.post('/api/attendance', requireAuth, attendanceController.createSubject);
app.patch('/api/attendance/:id/record', requireAuth, attendanceController.recordAttendance);
app.delete('/api/attendance/:id', requireAuth, attendanceController.deleteSubject);

// Focus Timer routes (Protected)
app.get('/api/timer/stats', requireAuth, timerController.getTimerStats);
app.post('/api/timer/session', requireAuth, timerController.recordSession);

// Chatbot route (Public or protected)
app.post('/api/chatbot', chatbotController.handleChat);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled API error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
