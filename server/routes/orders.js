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

router.post('/', (req, res) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const { shippingAddress } = req.body;
    if (!shippingAddress) return res.status(400).json({ error: 'shippingAddress is required.' });

    const cartItems = db.prepare(`
      SELECT ci.quantity, p.id as product_id, p.price
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = ?
    `).all(userId);

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const createOrder = db.transaction(() => {
      const orderResult = db.prepare(
        'INSERT INTO orders (user_id, total, shipping_address) VALUES (?, ?, ?)'
      ).run(userId, total, JSON.stringify(shippingAddress));

      const orderId = orderResult.lastInsertRowid;

      const insertItem = db.prepare(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)'
      );
      for (const item of cartItems) {
        insertItem.run(orderId, item.product_id, item.quantity, item.price);
      }

      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);

      return orderId;
    });

    const orderId = createOrder();
    res.status(201).json({ orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', (req, res) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const orders = db.prepare(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
    ).all(userId);

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, userId);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const items = db.prepare(`
      SELECT oi.quantity, oi.unit_price, p.id as product_id, p.name, p.sku, p.image_url
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ?
    `).all(order.id);

    res.json({ order, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
