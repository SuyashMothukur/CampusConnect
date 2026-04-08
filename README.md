# CampusConnect — Phase 6

Peer-to-peer skill exchange platform for university students.  
**Stack:** React + Vite · Node.js + Express · MySQL

---

## Setup

### 1. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
```

Edit `.env` with your MySQL credentials and a strong JWT secret:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=campusconnect
JWT_SECRET=some-long-random-string-change-this
PORT=5000
```

### 3. Set up the database

```sql
CREATE DATABASE campusconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then run the schema and seed files in MySQL Workbench or the CLI:

```bash
mysql -u root -p campusconnect < server/sql/schema.sql
mysql -u root -p campusconnect < server/sql/seed.sql
```

### 4. Create the initial admin user

```bash
mysql -u root -p campusconnect < server/sql/create_admin.sql
```

This creates:
- **Email:** `admin@campusconnect.edu`
- **Password:** `Admin1234!`

> Log in as admin and change the password immediately via the **Change Password** page.

### 5. Run the app

Open two terminals:

```bash
# Terminal 1 — backend (from /server)
npm run dev

# Terminal 2 — frontend (from /client)
npm run dev
```

App runs at **http://localhost:5173**

---

## Auth System (Phase 6 additions)

| Feature | Details |
|---|---|
| Signup | `POST /api/auth/signup` — any user can self-register as a student |
| Login | `POST /api/auth/login` — returns JWT (8h expiry) |
| Logout | `POST /api/auth/logout` — client drops token |
| Change Password | `POST /api/auth/change-password` — requires current password |
| Password storage | bcrypt with 12 salt rounds — no plaintext passwords stored |
| SQL injection | All queries use parameterized `?` placeholders |
| Admin creation | Admin logs in → Users page → create user with role=admin |

## Role Permissions

| Route | Student | Admin |
|---|---|---|
| Dashboard, Offerings, Sessions, Reviews | ✅ | ✅ |
| Change Password | ✅ | ✅ |
| Users page | ❌ | ✅ |
| Reports & Analytics | ❌ | ✅ |

## Reports (Admin only)

1. **Top Skill Categories** — request volume by category, broken down by status
2. **Provider Ratings** — avg rating, review count, sessions completed per provider  
3. **Monthly Session Activity** — completion rate trend over last 12 months
4. **Moderation Reports** — all flagged content with status
