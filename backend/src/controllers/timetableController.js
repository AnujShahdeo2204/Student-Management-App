const { query } = require('../db');

// GET /api/timetable
async function getTimetable(req, res) {
  try {
    const result = await query(
      'SELECT * FROM timetable WHERE user_id = $1 ORDER BY day, time_start ASC',
      [req.user.id]
    );
    return res.json({ timetable: result.rows });
  } catch (err) {
    console.error('getTimetable error:', err);
    return res.status(500).json({ error: 'Failed to fetch timetable schedule.' });
  }
}

// POST /api/timetable
async function createTimetableSlot(req, res) {
  try {
    const { day, subject, time_start, time_end, room, color } = req.body;
    if (!day || !subject || !time_start || !time_end) {
      return res.status(400).json({ error: 'Day, subject, start time, and end time are required.' });
    }

    const result = await query(
      'INSERT INTO timetable (user_id, day, subject, time_start, time_end, room, color) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [
        req.user.id,
        day,
        subject.trim(),
        time_start,
        time_end,
        room ? room.trim() : '',
        color || 'indigo',
      ]
    );

    return res.status(201).json({ slot: result.rows[0] });
  } catch (err) {
    console.error('createTimetableSlot error:', err);
    return res.status(500).json({ error: 'Failed to add timetable slot.' });
  }
}

// DELETE /api/timetable/:id
async function deleteTimetableSlot(req, res) {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM timetable WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Timetable entry not found.' });
    }

    return res.json({ message: 'Timetable entry deleted successfully.' });
  } catch (err) {
    console.error('deleteTimetableSlot error:', err);
    return res.status(500).json({ error: 'Failed to delete timetable entry.' });
  }
}

module.exports = {
  getTimetable,
  createTimetableSlot,
  deleteTimetableSlot,
};

