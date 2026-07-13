const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res) => {
  try {
    const { search, category } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR sku LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    query += ' ORDER BY category, name';

    const products = db.prepare(query).all(...params);
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
