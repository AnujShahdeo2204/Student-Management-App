const { query } = require('../db');

// GET /api/todos
async function getTodos(req, res) {
  try {
    const result = await query(
      'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    return res.json({ todos: result.rows });
  } catch (err) {
    console.error('getTodos error:', err);
    return res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
}

// POST /api/todos
async function createTodo(req, res) {
  try {
    const { title, category, priority, due_date } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await query(
      'INSERT INTO todos (user_id, title, category, priority, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        req.user.id,
        title.trim(),
        category || 'General',
        priority || 'medium',
        due_date || null,
      ]
    );

    return res.status(201).json({ todo: result.rows[0] });
  } catch (err) {
    console.error('createTodo error:', err);
    return res.status(500).json({ error: 'Failed to create task.' });
  }
}

// PATCH /api/todos/:id/toggle
async function toggleTodo(req, res) {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const result = await query(
      'UPDATE todos SET completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [Boolean(completed), id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    return res.json({ todo: result.rows[0] });
  } catch (err) {
    console.error('toggleTodo error:', err);
    return res.status(500).json({ error: 'Failed to update task status.' });
  }
}

// DELETE /api/todos/:id
async function deleteTodo(req, res) {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *', [
      id,
      req.user.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    return res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    console.error('deleteTodo error:', err);
    return res.status(500).json({ error: 'Failed to delete task.' });
  }
}

module.exports = {
  getTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
};

