# CampusConnect

A database-driven web application that enables peer-to-peer skill exchange among university students. Students can create profiles, list skills they offer, browse available peer providers, request help sessions, and leave reviews — replacing informal coordination methods like group chats with a structured, accountable platform.

**CS 4604 — Database Systems | Group 43 | Spring 2026**  
Parth Mehta · Anurag Pokala · Donald Manka · Suyash Mothukuri

---

## Features

- Secure signup, login, logout, and password change (bcrypt hashed passwords, JWT authentication)
- Role-based access: Student and Admin
- Admin can create and manage users through the application
- Skill offering creation, browsing, and management
- Session request workflow (submit, accept, decline, cancel)
- Availability scheduling
- Post-session reviews and ratings
- In-platform messaging threads
- Moderation reports
- Admin analytics dashboard (top skills, provider ratings, session activity)
- Full SQL injection protection via parameterized queries

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MySQL 8.x |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Diagrams | Lucidchart |

---

## Repository Structure

```
CampusConnect/
├── README.md               ← this file
├── docs/                   ← diagrams, screenshots, report materials
├── db/                     ← schema, seed data, admin setup SQL
│   ├── schema.sql
│   ├── seed.sql
│   └── create_admin.sql
├── reports/                ← analytics and report materials
├── roles/                  ← team member contributions
├── client/                 ← React frontend (Vite)
│   └── src/
│       ├── pages/          ← Login, Signup, Dashboard, Reports, etc.
│       ├── context/        ← AuthContext (JWT state management)
│       ├── api/            ← API client with auto token attachment
│       └── layouts/        ← AppLayout with role-based navigation
└── server/                 ← Express backend
    ├── src/
    │   ├── controllers/    ← auth, users, offerings, sessions, reports...
    │   ├── middleware/      ← JWT auth middleware, role guards
    │   ├── routes/         ← api.js (all protected routes)
    │   └── db.js           ← MySQL connection pool
    └── sql/                ← schema, seed, admin scripts
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- MySQL 8.x (`brew install mysql` on Mac)

### 1. Clone the repo
```bash
git clone https://github.com/SuyashMothukur/CampusConnect.git
cd CampusConnect
```

### 2. Start MySQL and create the database
```bash
brew services start mysql
mysql -u root -e "CREATE DATABASE IF NOT EXISTS campusconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 3. Load the schema, seed data, and admin user
```bash
mysql -u root campusconnect < db/schema.sql
mysql -u root campusconnect < db/seed.sql
mysql -u root campusconnect < db/create_admin.sql
```

### 4. Configure environment
```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=campusconnect
JWT_SECRET=your-long-random-secret-here
PORT=5000
```

### 5. Install dependencies and run
```bash
npm run install:all
npm run dev
```

App runs at **http://localhost:5173**

---

## Default Admin Account

After running `db/create_admin.sql`:

| Field | Value |
|---|---|
| Email | admin@campusconnect.edu |
| Password | Admin1234! |

> Log in as admin and change the password immediately via the Change Password page.

---

## Authentication & Security

- Passwords are hashed with **bcrypt** (12 salt rounds) — never stored as plaintext
- Authentication uses **JWT tokens** (8-hour expiry) stored in localStorage
- Every protected API route requires a valid token via `Authorization: Bearer <token>`
- Admin-only routes (Users, Reports) are guarded on both frontend and backend
- All database queries use **parameterized placeholders** (`?`) — no string concatenation, fully protected against SQL injection

---

## User Roles

| Feature | Student | Admin |
|---|---|---|
| Signup / Login / Logout | ✅ | ✅ |
| Change Password | ✅ | ✅ |
| Browse Skill Offerings | ✅ | ✅ |
| Submit Session Requests | ✅ | ✅ |
| Leave Reviews | ✅ | ✅ |
| Manage All Users | ❌ | ✅ |
| View Analytics Reports | ❌ | ✅ |

---

## Analytics Reports (Admin Only)

1. **Top Skill Categories by Request Volume** — shows demand per category with accepted/pending/declined breakdown
2. **Provider Ratings** — average rating, review count, and completed sessions per provider
3. **Monthly Session Activity** — completion rate trend over the last 12 months
4. **Moderation Reports** — all flagged content with status tracking
