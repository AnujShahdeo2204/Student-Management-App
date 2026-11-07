const { query } = require('../db');

// GET /api/timer/stats
async function getTimerStats(req, res) {
  try {
    const result = await query(
      'SELECT * FROM timer_sessions WHERE user_id = $1 ORDER BY completed_at DESC',
      [req.user.id]
    );

    const totalMinutes = result.rows.reduce(
      (sum, s) => sum + (Number(s.duration_minutes) || 0),
      0
    );

    return res.json({
      sessions: result.rows,
      totalMinutes,
      totalHours: Number((totalMinutes / 60).toFixed(1)),
      sessionCount: result.rows.length,
    });
  } catch (err) {
    console.error('getTimerStats error:', err);
    return res.status(500).json({ error: 'Failed to fetch focus timer statistics.' });
  }
}

// POST /api/timer/session
async function recordSession(req, res) {
  try {
    const { duration_minutes, session_type } = req.body;
    const duration = Number(duration_minutes) || 25;

    const result = await query(
      'INSERT INTO timer_sessions (user_id, duration_minutes, session_type) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, duration, session_type || 'pomodoro']
    );

    return res.status(201).json({ session: result.rows[0] });
  } catch (err) {
    console.error('recordSession error:', err);
    return res.status(500).json({ error: 'Failed to record timer session.' });
  }
}

module.exports = {
  getTimerStats,
  recordSession,
};

