const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.put('/profile', (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Authentication required.' });

    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' });

    const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, parseInt(userId, 10));
    if (existing) return res.status(409).json({ error: 'Email is already in use.' });

    db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').run(name, email, parseInt(userId, 10));

    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(parseInt(userId, 10));
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
