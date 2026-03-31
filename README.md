# CampusConnect

Full-stack demo: **React (Vite)** + **Express** + **MySQL**. The UI performs real CRUD against the database through a JSON REST API.

## Prerequisites

- **Node.js** 18+ (you have network access for `npm install`)
- **MySQL** 8.x (recommended; schema uses a `CHECK` constraint on review ratings)

## 1. Database setup

1. Start MySQL and create the database:

```sql
CREATE DATABASE campusconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Apply schema and seed data (from the project root):

```bash
mysql -u root -p campusconnect < server/sql/schema.sql
mysql -u root -p campusconnect < server/sql/seed.sql
```

Adjust the MySQL user/host as needed.

## 2. Backend (Express API)

1. Copy environment file and edit credentials:

```bash
cd server
cp .env.example .env
```

Set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`. Default API port is **5001** (avoids macOS **AirPlay Receiver** using port 5000).

2. Install and run:

```bash
npm install
npm run dev
```

You should see: `CampusConnect API listening on http://127.0.0.1:5001`

Verify: [http://127.0.0.1:5001/health](http://127.0.0.1:5001/health)

## 3. Frontend (React)

In a **second terminal**:

```bash
cd client
npm install
npm run dev
```

Open the URL Vite prints (typically [http://127.0.0.1:5173](http://127.0.0.1:5173)).

The dev server **proxies** `/api/*` to `http://127.0.0.1:5001`, so the React app talks to your local Express API without CORS issues.

## 4. Demo checklist

- **Dashboard**: counts come from live `COUNT(*)` queries.
- **Users**: search/filter, create, edit, delete (with confirmation). Deletes cascade related rows where foreign keys define `ON DELETE CASCADE`.
- **Skill Offerings**, **Session Requests**, **Reviews**: full CRUD with success/error messages and loading states.
- **Availability**, **Sessions**, **Reports**: read-only lists backed by MySQL (extend with POST/PUT/DELETE when you need them).

After inserts/updates/deletes, refresh the Dashboard or revisit a list to show that the GUI and database stay in sync.

## Project layout

- `server/` — Express app (`src/routes`, `src/controllers`, `src/db.js`), SQL under `server/sql/`
- `client/` — Vite + React app (`src/pages`, `src/components`, `src/api/client.js`)

## Production build (optional)

```bash
cd client && npm run build
```

Serve the `client/dist` folder with any static host; configure that host to forward `/api` to your Express server, or set `VITE_*` / full API URL if you add a production base URL later.
