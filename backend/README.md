# Backend

Server-side code is in `../server/`.

## Structure

**`server/src/controllers/`** — Route handlers: auth, users, offerings, sessions, availability, reviews, reports

**`server/src/middleware/`** — requireAuth (JWT verification), requireAdmin (role check)

**`server/src/routes/api.js`** — All API route definitions

**`server/src/db.js`** — MySQL connection pool (mysql2)

**`server/src/index.js`** — Express entry point

**`server/sql/`** — schema.sql, seed.sql, create_admin.sql

## Stack

- Node.js 18+ / Express
- mysql2 (parameterized queries, connection pooling)
- jsonwebtoken + bcrypt (auth, password hashing at 12 salt rounds)

## Security

- Passwords hashed with bcrypt — never stored in plaintext
- All queries use `?` parameterized placeholders — SQL injection protected
- Protected routes require `Authorization: Bearer <token>`
- Admin routes additionally check `req.user.role === 'admin'`