const express = require('express');
const router = express.Router();
const db = require('../db/db');

function requireUser(req, res) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    res.status(401).json({ error: 'Authentication required.' });
    return null;
  }
  return parseInt(userId, 10);
}

router.get('/', (req, res) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const items = db.prepare(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.sku, p.name, p.price, p.image_url, p.category
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = ?
      ORDER BY ci.id
    `).all(userId);

    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId is required.' });

    const existing = db.prepare('SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?').get(userId, productId);
    if (existing) {
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(existing.quantity + quantity, existing.id);
    } else {
      db.prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)').run(userId, productId, quantity);
    }

    const items = db.prepare(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.sku, p.name, p.price, p.image_url, p.category
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = ?
      ORDER BY ci.id
    `).all(userId);

    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:productId', (req, res) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const { quantity } = req.body;
    const productId = parseInt(req.params.productId, 10);

    if (quantity === 0 || quantity === undefined) {
      db.prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?').run(userId, productId);
    } else {
      db.prepare('UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?').run(quantity, userId, productId);
    }

    const items = db.prepare(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.sku, p.name, p.price, p.image_url, p.category
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = ?
      ORDER BY ci.id
    `).all(userId);

    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:productId', (req, res) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const productId = parseInt(req.params.productId, 10);
    db.prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?').run(userId, productId);

    const items = db.prepare(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.sku, p.name, p.price, p.image_url, p.category
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = ?
      ORDER BY ci.id
    `).all(userId);

    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
