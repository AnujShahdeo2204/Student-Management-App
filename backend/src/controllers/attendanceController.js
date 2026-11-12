const { query } = require('../../../database/db');

// GET /api/attendance
async function getAttendance(req, res) {
  try {
    const result = await query(
      'SELECT * FROM attendance WHERE user_id = $1 ORDER BY subject ASC',
      [req.user.id]
    );
    return res.json({ attendance: result.rows });
  } catch (err) {
    console.error('getAttendance error:', err);
    return res.status(500).json({ error: 'Failed to fetch attendance.' });
  }
}

// POST /api/attendance
async function createSubject(req, res) {
  try {
    const { subject, attended, total, target_percentage } = req.body;
    if (!subject || !subject.trim()) {
      return res.status(400).json({ error: 'Subject name is required.' });
    }

    const attendedCount = Number(attended) || 0;
    const totalCount = Number(total) || 0;
    const target = Number(target_percentage) || 75;

    const result = await query(
      'INSERT INTO attendance (user_id, subject, attended, total, target_percentage) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, subject.trim(), attendedCount, totalCount, target]
    );

    return res.status(201).json({ item: result.rows[0] });
  } catch (err) {
    console.error('createSubject error:', err);
    return res.status(500).json({ error: 'Failed to add attendance subject.' });
  }
}

// PATCH /api/attendance/:id/record
// body: { action: 'present' | 'absent' | 'reset' }
async function recordAttendance(req, res) {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const existing = await query(
      'SELECT * FROM attendance WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Subject not found.' });
    }

    let { attended, total } = existing.rows[0];
    attended = Number(attended);
    total = Number(total);

    if (action === 'present') {
      attended += 1;
      total += 1;
    } else if (action === 'absent') {
      total += 1;
    } else if (action === 'reset') {
      attended = 0;
      total = 0;
    } else {
      return res.status(400).json({ error: "Invalid action. Use 'present', 'absent', or 'reset'." });
    }

    const result = await query(
      'UPDATE attendance SET attended = $1, total = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [attended, total, id, req.user.id]
    );

    return res.json({ item: result.rows[0] });
  } catch (err) {
    console.error('recordAttendance error:', err);
    return res.status(500).json({ error: 'Failed to record attendance.' });
  }
}

// DELETE /api/attendance/:id
async function deleteSubject(req, res) {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM attendance WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subject not found.' });
    }

    return res.json({ message: 'Subject deleted successfully.' });
  } catch (err) {
    console.error('deleteSubject error:', err);
    return res.status(500).json({ error: 'Failed to delete subject.' });
  }
}

module.exports = {
  getAttendance,
  createSubject,
  recordAttendance,
  deleteSubject,
};
