const { Pool } = require('pg');

let pool = null;
const isPostgresConfigured = Boolean(process.env.DATABASE_URL);

if (isPostgresConfigured) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost')
      ? false
      : { rejectUnauthorized: false },
  });
}

// Fallback in-memory store for local testing without DB configuration
const mockStore = {
  users: [],
  todos: [],
  timetable: [],
  attendance: [],
  timer_sessions: [],
  nextId: 1,
};

async function initDB() {
  if (!pool) {
    console.log('[Database] Running in Local Memory Fallback Mode (No DATABASE_URL provided)');
    return;
  }

  try {
    const client = await pool.connect();
    console.log('[Database] Connected to PostgreSQL successfully');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) DEFAULT 'General',
        priority VARCHAR(20) DEFAULT 'medium',
        due_date VARCHAR(50),
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS timetable (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        day VARCHAR(20) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        time_start VARCHAR(20) NOT NULL,
        time_end VARCHAR(20) NOT NULL,
        room VARCHAR(50),
        color VARCHAR(30) DEFAULT 'indigo',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        subject VARCHAR(100) NOT NULL,
        attended INTEGER DEFAULT 0,
        total INTEGER DEFAULT 0,
        target_percentage INTEGER DEFAULT 75,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS timer_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        duration_minutes INTEGER NOT NULL,
        session_type VARCHAR(50) DEFAULT 'pomodoro',
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    client.release();
    console.log('[Database] Tables initialized successfully');
  } catch (err) {
    console.error('[Database] PostgreSQL initialization warning:', err.message);
    console.log('[Database] Falling back to memory store until database URL is verified.');
    pool = null;
  }
}

// Helper query function that routes either to PG Pool or mockStore
async function query(text, params = []) {
  if (pool) {
    return pool.query(text, params);
  }

  // Basic SQL parser for in-memory fallback
  const normalized = text.trim().toLowerCase();

  // USERS
  if (normalized.startsWith('insert into users')) {
    const [name, email, password_hash] = params;
    const user = {
      id: mockStore.nextId++,
      name,
      email,
      password_hash,
      created_at: new Date().toISOString(),
    };
    mockStore.users.push(user);
    return { rows: [user] };
  }

  if (normalized.startsWith('select * from users where email')) {
    const [email] = params;
    const user = mockStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return { rows: user ? [user] : [] };
  }

  if (normalized.startsWith('select id, name, email from users where id')) {
    const [id] = params;
    const user = mockStore.users.find((u) => u.id === Number(id));
    return { rows: user ? [{ id: user.id, name: user.name, email: user.email }] : [] };
  }

  // TODOS
  if (normalized.startsWith('select * from todos where user_id')) {
    const [userId] = params;
    const rows = mockStore.todos.filter((t) => t.user_id === Number(userId));
    return { rows };
  }

  if (normalized.startsWith('insert into todos')) {
    const [userId, title, category, priority, due_date] = params;
    const todo = {
      id: mockStore.nextId++,
      user_id: Number(userId),
      title,
      category: category || 'General',
      priority: priority || 'medium',
      due_date: due_date || null,
      completed: false,
      created_at: new Date().toISOString(),
    };
    mockStore.todos.push(todo);
    return { rows: [todo] };
  }

  if (normalized.startsWith('update todos set completed =')) {
    const [completed, id, userId] = params;
    const todo = mockStore.todos.find((t) => t.id === Number(id) && t.user_id === Number(userId));
    if (todo) {
      todo.completed = completed;
      return { rows: [todo] };
    }
    return { rows: [] };
  }

  if (normalized.startsWith('delete from todos where id')) {
    const [id, userId] = params;
    const idx = mockStore.todos.findIndex((t) => t.id === Number(id) && t.user_id === Number(userId));
    if (idx !== -1) {
      const deleted = mockStore.todos.splice(idx, 1);
      return { rows: deleted };
    }
    return { rows: [] };
  }

  // TIMETABLE
  if (normalized.startsWith('select * from timetable where user_id')) {
    const [userId] = params;
    const rows = mockStore.timetable.filter((t) => t.user_id === Number(userId));
    return { rows };
  }

  if (normalized.startsWith('insert into timetable')) {
    const [userId, day, subject, time_start, time_end, room, color] = params;
    const slot = {
      id: mockStore.nextId++,
      user_id: Number(userId),
      day,
      subject,
      time_start,
      time_end,
      room: room || '',
      color: color || 'indigo',
      created_at: new Date().toISOString(),
    };
    mockStore.timetable.push(slot);
    return { rows: [slot] };
  }

  if (normalized.startsWith('delete from timetable where id')) {
    const [id, userId] = params;
    const idx = mockStore.timetable.findIndex((t) => t.id === Number(id) && t.user_id === Number(userId));
    if (idx !== -1) {
      const deleted = mockStore.timetable.splice(idx, 1);
      return { rows: deleted };
    }
    return { rows: [] };
  }

  // ATTENDANCE
  if (normalized.startsWith('select * from attendance where id')) {
    const [id, userId] = params;
    const item = mockStore.attendance.find((a) => a.id === Number(id) && a.user_id === Number(userId));
    return { rows: item ? [item] : [] };
  }

  if (normalized.startsWith('select * from attendance where user_id')) {
    const [userId] = params;
    const rows = mockStore.attendance.filter((a) => a.user_id === Number(userId));
    return { rows };
  }

  if (normalized.startsWith('insert into attendance')) {
    const [userId, subject, attended, total, target] = params;
    const item = {
      id: mockStore.nextId++,
      user_id: Number(userId),
      subject,
      attended: Number(attended) || 0,
      total: Number(total) || 0,
      target_percentage: Number(target) || 75,
      created_at: new Date().toISOString(),
    };
    mockStore.attendance.push(item);
    return { rows: [item] };
  }

  if (normalized.startsWith('update attendance set attended =')) {
    const [attended, total, id, userId] = params;
    const item = mockStore.attendance.find((a) => a.id === Number(id) && a.user_id === Number(userId));
    if (item) {
      item.attended = Number(attended);
      item.total = Number(total);
      return { rows: [item] };
    }
    return { rows: [] };
  }

  if (normalized.startsWith('delete from attendance where id')) {
    const [id, userId] = params;
    const idx = mockStore.attendance.findIndex((a) => a.id === Number(id) && a.user_id === Number(userId));
    if (idx !== -1) {
      const deleted = mockStore.attendance.splice(idx, 1);
      return { rows: deleted };
    }
    return { rows: [] };
  }

  // TIMER SESSIONS
  if (normalized.startsWith('select * from timer_sessions where user_id')) {
    const [userId] = params;
    const rows = mockStore.timer_sessions.filter((s) => s.user_id === Number(userId));
    return { rows };
  }

  if (normalized.startsWith('insert into timer_sessions')) {
    const [userId, duration_minutes, session_type] = params;
    const session = {
      id: mockStore.nextId++,
      user_id: Number(userId),
      duration_minutes: Number(duration_minutes) || 25,
      session_type: session_type || 'pomodoro',
      completed_at: new Date().toISOString(),
    };
    mockStore.timer_sessions.push(session);
    return { rows: [session] };
  }

  return { rows: [] };
}

module.exports = {
  query,
  initDB,
  isPostgresConfigured,
};
