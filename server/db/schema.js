const db = require('./db');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      stock INTEGER DEFAULT 100,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      status TEXT DEFAULT 'pending',
      subtotal REAL NOT NULL DEFAULT 0,
      tax REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      shipping_address TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER REFERENCES orders(id),
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER NOT NULL DEFAULT 1
    );
  `);

  // Existing databases created before tax support was added won't have these
  // columns yet, since CREATE TABLE IF NOT EXISTS doesn't alter existing tables.
  const orderColumns = db.prepare("PRAGMA table_info(orders)").all().map(c => c.name);
  if (!orderColumns.includes('subtotal')) {
    db.exec('ALTER TABLE orders ADD COLUMN subtotal REAL NOT NULL DEFAULT 0');
  }
  if (!orderColumns.includes('tax')) {
    db.exec('ALTER TABLE orders ADD COLUMN tax REAL NOT NULL DEFAULT 0');
  }
}

module.exports = { initSchema };
