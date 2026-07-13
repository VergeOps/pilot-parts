# PilotParts

Aviation parts e-commerce demo app

## Prerequisites

- **Node.js 18 or higher** — [download from nodejs.org](https://nodejs.org/) or install via a version manager:
  - macOS (Homebrew): `brew install node`
  - nvm: `nvm install 18 && nvm use 18`
- **npm 8 or higher** — bundled with Node.js. Verify with `npm --version`.

No other software (databases, services, etc.) needs to be installed separately — the app uses SQLite via `better-sqlite3`, which is installed automatically as an npm dependency and stores its data in a local file.

Verify your versions before continuing:

```bash
node --version   # should print v18.x.x or higher
npm --version    # should print 8.x.x or higher
```

## Setup

1. Clone or download this repository and open a terminal in the `pilotparts` folder.
2. Install dependencies for the root project, client, and server in one step:

   ```bash
   cd pilotparts
   npm run install:all
   ```

   This runs `npm install` in `pilotparts/`, `pilotparts/client/`, and `pilotparts/server/`.

3. Start the app:

   ```bash
   npm start
   ```

   This will seed the SQLite database (safe to run repeatedly — it skips seeding if data already exists) and start both the API server and the frontend dev server concurrently.

4. Open the frontend in your browser:

   - Frontend: http://localhost:5500
   - API: http://localhost:3001

To stop the app, press `Ctrl+C` in the terminal.

## Other useful commands

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install dependencies for root, client, and server |
| `npm run seed` | Seed the database manually (idempotent) |
| `npm run dev` | Start client and server without reseeding the database |
| `npm start` | Seed the database, then start client and server |

## Demo Login Credentials

| Name | Email | Password |
|------|-------|----------|
| Alice Pilot | alice@example.com | password123 |
| Bob Mechanic | bob@example.com | password123 |
| Carol Student | carol@example.com | password123 |

## Tech Stack

- **Frontend**: React 18, Vite, React Router v6
- **Backend**: Node.js, Express 4
- **Database**: SQLite via better-sqlite3
- **Styling**: Plain CSS with CSS custom properties

## Notes

This is a demo app. No real payments are processed and authentication is plaintext — for development/demonstration purposes only.
