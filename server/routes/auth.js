const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = db.prepare('SELECT id, name, email FROM users WHERE email = ? AND password = ?').get(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
