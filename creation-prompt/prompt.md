# PilotParts — Claude Code Build Prompt
 
## Project Overview
 
Build a full-stack aviation parts e-commerce web app called **PilotParts**. It is a demo/dev app — no real payments, no real auth, no external services required. Everything must run on a developer workstation with a single `npm install && npm start` from the project root.
 
---
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), React Router v6 |
| Backend | Node.js 18+, Express 4 |
| Database | SQLite via `better-sqlite3` |
| Styling | Plain CSS (no Tailwind, no UI library) — see Design System below |
| Dev runner | `concurrently` to run API + Vite dev server together |
 
The project root should contain:
- `/client` — Vite + React frontend
- `/server` — Express API + SQLite
- `/server/db` — database file and seed script
- `package.json` at root with scripts: `install:all`, `dev` (runs both), `seed`
---
 
## Database Schema (SQLite / better-sqlite3)
 
### `users`
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT UNIQUE NOT NULL,
password TEXT NOT NULL,       -- plaintext, demo only
name TEXT NOT NULL,
created_at TEXT DEFAULT (datetime('now'))
```
 
### `products`
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT,
sku TEXT UNIQUE NOT NULL,
name TEXT NOT NULL,
description TEXT,
price REAL NOT NULL,
category TEXT NOT NULL,
stock INTEGER DEFAULT 100,
image_url TEXT
```
 
### `orders`
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER REFERENCES users(id),
status TEXT DEFAULT 'pending',   -- pending | processing | shipped | delivered
total REAL NOT NULL,
created_at TEXT DEFAULT (datetime('now')),
shipping_address TEXT NOT NULL   -- JSON string
```
 
### `order_items`
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT,
order_id INTEGER REFERENCES orders(id),
product_id INTEGER REFERENCES products(id),
quantity INTEGER NOT NULL,
unit_price REAL NOT NULL
```
 
### `cart_items`
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER REFERENCES users(id),
product_id INTEGER REFERENCES products(id),
quantity INTEGER NOT NULL DEFAULT 1
```
 
---
 
## Seed Data
 
### Pre-seeded Users (3 accounts)
 
| Name | Email | Password |
|---|---|---|
| Alice Pilot | alice@example.com | password123 |
| Bob Mechanic | bob@example.com | password123 |
| Carol Student | carol@example.com | password123 |
 
### Products (25 items)
 
Seed exactly these 25 products modeled after real Aircraft Spruce inventory. Use realistic SKUs, prices, and descriptions. Distribute across these 6 categories: **Avionics**, **Pilot Supplies**, **Hardware**, **Tools**, **Engines & Parts**, **Safety Equipment**.
 
| SKU | Name | Category | Price |
|---|---|---|---|
| AV-001 | Garmin GNX 375 GPS/ADS-B Receiver | Avionics | 2895.00 |
| AV-002 | Stratus 4 ADS-B Receiver | Avionics | 899.00 |
| AV-003 | Garmin GTX 345 ADS-B Transponder | Avionics | 1995.00 |
| AV-004 | Dynon SkyView HDX Display 10" | Avionics | 2650.00 |
| AV-005 | Garmin GMA 245 Audio Panel | Avionics | 1195.00 |
| PS-001 | David Clark H10-13.4 Headset | Pilot Supplies | 329.00 |
| PS-002 | Lightspeed Zulu 3 ANR Headset | Pilot Supplies | 850.00 |
| PS-003 | Sporty's E6B Flight Computer | Pilot Supplies | 29.95 |
| PS-004 | ASA Private Pilot Test Prep 2025 | Pilot Supplies | 39.95 |
| PS-005 | Foreflight Mobile Pro Annual Sub | Pilot Supplies | 179.99 |
| HW-001 | AN3-10A Bolt Hex Head 10-Pack | Hardware | 4.75 |
| HW-002 | MS20365-1032 Hex Nut 50-Pack | Hardware | 6.50 |
| HW-003 | Cotter Pin Assortment Kit 200pc | Hardware | 12.95 |
| HW-004 | Aircraft Grade Safety Wire 1lb | Hardware | 18.50 |
| HW-005 | Adel Clamp Assortment 40pc | Hardware | 24.95 |
| TL-001 | Aircraft Safety Wire Twister Pliers | Tools | 44.95 |
| TL-002 | Swivel Head Inspection Mirror | Tools | 16.95 |
| TL-003 | Timing Light Advance Degree Kit | Tools | 89.95 |
| TL-004 | Borescope 5.5mm USB Camera | Tools | 62.00 |
| TL-005 | Torque Wrench 3/8" Drive 150 ft-lb | Tools | 135.00 |
| EP-001 | Lycoming O-360 Overhaul Gasket Set | Engines & Parts | 219.00 |
| EP-002 | Champion Spark Plug REM37BY | Engines & Parts | 18.95 |
| EP-003 | Aircraft Oil Filter Adapter Kit | Engines & Parts | 74.50 |
| SF-001 | ACR ResQLink 400 PLB | Safety Equipment | 299.00 |
| SF-002 | Stratus ESG Emergency ELT | Safety Equipment | 649.00 |
 
For each product, write a 1–2 sentence realistic product description in the seed data.
 
Use placeholder images from `https://placehold.co/300x300?text=SKU` substituting the actual SKU, since no real image assets are available.
 
---
 
## API Endpoints (Express)
 
### Auth
- `POST /api/auth/login` — body: `{ email, password }` → returns `{ user }` (no JWT; store user in React state / localStorage)
- `POST /api/auth/logout` — clears session (client-side only; API just returns 200)
### Products
- `GET /api/products` — returns all products; supports query params: `?search=`, `?category=`
- `GET /api/products/:id` — single product detail
### Cart
All cart routes require `userId` passed as `X-User-Id` header (demo auth pattern).
- `GET /api/cart` — returns cart items with product details joined
- `POST /api/cart` — body: `{ productId, quantity }` — adds or increments item
- `PUT /api/cart/:productId` — body: `{ quantity }` — updates quantity (0 = remove)
- `DELETE /api/cart/:productId` — removes item
### Orders
- `POST /api/orders` — body: `{ shippingAddress, paymentInfo }` — creates order from current cart, clears cart; `paymentInfo` is accepted as-is (any card number), not validated
- `GET /api/orders` — returns order history for user
- `GET /api/orders/:id` — order detail with line items
### Users
- `PUT /api/users/profile` — body: `{ name, email }` — update account info
---
 
## Frontend Routes (React Router)
 
| Path | Component | Description |
|---|---|---|
| `/` | `HomePage` | Hero banner + featured products grid |
| `/products` | `ProductsPage` | Full catalog with search + category filter |
| `/products/:id` | `ProductDetailPage` | Product image, description, price, Add to Cart |
| `/cart` | `CartPage` | Line items, quantities, subtotal, Checkout button |
| `/checkout` | `CheckoutPage` | Shipping form + payment form (demo card fields) |
| `/order-confirmation/:id` | `OrderConfirmationPage` | Thank-you page with order summary |
| `/account` | `AccountPage` | Profile editor + order history list |
| `/account/orders/:id` | `OrderDetailPage` | Full order detail with status + line items |
| `/login` | `LoginPage` | Email + password form, pre-seeded user hint shown on page |
 
### Global Components
- `Navbar` — Logo, nav links (Home, Products, Account), cart icon with item count badge, login/logout
- `Footer` — Links, copyright line styled like Aircraft Spruce
- `AuthContext` — React context providing `user`, `login()`, `logout()`
- `CartContext` — React context providing cart state, `addToCart()`, `updateQty()`, `removeItem()`, synced to API
---
 
## Design System (Aircraft Spruce-inspired)
 
Replicate the general look and feel of aircraftspruce.com. Key characteristics:
 
### Colors (CSS custom properties on `:root`)
```css
--color-primary: #cc0000;        /* red — used for buttons, accents, header bar */
--color-primary-dark: #990000;
--color-secondary: #003366;      /* navy — used for nav background */
--color-bg: #ffffff;
--color-bg-alt: #f4f4f4;         /* light gray for alternating rows, sidebars */
--color-border: #cccccc;
--color-text: #222222;
--color-text-muted: #666666;
--color-link: #003366;
--color-link-hover: #cc0000;
```
 
### Typography
- Font stack: `Arial, Helvetica, sans-serif` (no Google Fonts import needed)
- Base font size: 14px (compact, utilitarian)
- Product names: 14–16px bold
- Prices: 16px bold, `--color-primary`
- Page headings: 20–22px bold
### Layout
- Max content width: 1200px, centered
- Header: full-width red top bar with white logo text "PilotParts", below it a navy nav bar with category links
- Product grid: 4 columns on desktop, 2 on tablet, 1 on mobile
- Product cards: white background, 1px border, product image top, name, price, "Add to Cart" button — compact, no excessive padding
### Buttons
- Primary (Add to Cart, Checkout): `--color-primary` background, white text, no border-radius (square corners, utilitarian)
- Secondary: white background, `--color-border` border
- Hover state: `--color-primary-dark`
### Forms
- Label above input
- Inputs: full width, 1px `--color-border` border, 4px padding, 14px font
- Error states: red border + red helper text
---
 
## Checkout Flow Detail
 
`CheckoutPage` has two sections:
 
**1. Shipping Address**
Fields: Full Name, Address Line 1, Address Line 2 (optional), City, State (dropdown — US states), ZIP, Country (default USA)
 
**2. Payment Information (Demo)**
Fields: Cardholder Name, Card Number (accepts any 13–19 digit number), Expiry MM/YY, CVV (any 3–4 digits)
Display a banner: `"⚠️ Demo Mode — No real payment is processed. Enter any card number."`
 
On submit: POST to `/api/orders`, redirect to `/order-confirmation/:id`.
 
---
 
## Account Page Detail
 
Two tabs or sections:
 
**Profile**
- Edit name and email; save via `PUT /api/users/profile`
**Order History**
- Table: Order #, Date, Status (colored badge — pending=gray, processing=blue, shipped=orange, delivered=green), Total, View Details link
- Order detail page shows line items, quantities, unit prices, shipping address, current status
---
 
## Error Handling
 
- API: all routes wrapped in try/catch, return `{ error: "message" }` with appropriate HTTP status
- Frontend: show inline error messages for failed API calls (no alert() calls)
- 404 route in React Router rendering a simple "Page Not Found" component
---
 
## Project Structure
 
```
pilotparts/
├── package.json                  # root: scripts for dev, install:all, seed
├── client/
│   ├── package.json
│   ├── vite.config.js            # proxy /api → http://localhost:3001
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx               # Router + context providers
│       ├── index.css             # global CSS variables and resets
│       ├── contexts/
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   └── ProductCard.jsx
│       └── pages/
│           ├── HomePage.jsx
│           ├── ProductsPage.jsx
│           ├── ProductDetailPage.jsx
│           ├── CartPage.jsx
│           ├── CheckoutPage.jsx
│           ├── OrderConfirmationPage.jsx
│           ├── AccountPage.jsx
│           ├── OrderDetailPage.jsx
│           └── LoginPage.jsx
└── server/
    ├── package.json
    ├── index.js                  # Express app entry point, port 3001
    ├── db/
    │   ├── schema.js             # CREATE TABLE statements, run once
    │   ├── seed.js               # inserts users + 25 products
    │   └── pilotparts.db         # auto-created on first run (gitignored)
    └── routes/
        ├── auth.js
        ├── products.js
        ├── cart.js
        ├── orders.js
        └── users.js
```
 
---
 
## Root package.json Scripts
 
```json
{
  "scripts": {
    "install:all": "npm install && cd client && npm install && cd ../server && npm install",
    "seed": "node server/db/seed.js",
    "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"",
    "start": "npm run seed && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```
 
The server's `index.js` should auto-run `schema.js` on startup (create tables if not exists) so the DB is always initialized before routes are registered. The seed script should check `SELECT COUNT(*) FROM products` and skip seeding if data already exists (idempotent).
 
---
 
## Vite Proxy Config
 
```js
// client/vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
}
```
 
---
 
## Final Instructions to Claude Code
 
1. Scaffold the entire project directory tree first.
2. Write the database schema and seed script before any routes.
3. Build all API routes and verify they are complete before moving to the frontend.
4. Build the frontend from shared components (Navbar, Footer, CSS variables) outward to pages.
5. Ensure the app is fully functional end-to-end: login → browse → add to cart → checkout → view order.
6. Do not use any CSS framework (no Tailwind, Bootstrap, etc.) — hand-write all CSS using the design tokens above.
7. Do not use any auth library — the mock login simply looks up the user by email+password in SQLite and stores `{ id, name, email }` in localStorage and React state.
8. Add a README.md with: prerequisites (Node 18+), one-command startup (`npm start` from root), and the three pre-seeded login credentials.