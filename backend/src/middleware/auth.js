const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'student-management-secret-key-2026';

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required. Please sign in.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token. Please sign in again.' });
  }
}

module.exports = {
  requireAuth,
  JWT_SECRET,
};

