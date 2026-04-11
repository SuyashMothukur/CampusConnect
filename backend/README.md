# Backend

Server-side code is in `../server/`.

## Structure
server/
├── src/
│   ├── controllers/    ← auth, users, offerings, sessions, availability, reviews, reports
│   ├── middleware/     ← requireAuth (JWT), requireAdmin (role check)
│   ├── routes/         ← api.js (all routes)
│   ├── db.js           ← MySQL connection pool
│   ├── index.js        ← Express entry point
│   └── utils/http.js   ← sendOk / sendError helpers
├── sql/                ← schema.sql, seed.sql, create_admin.sql
└── .env.example

## Stack

- Node.js 18+ / Express
- mysql2 (parameterized queries, connection pooling)
- jsonwebtoken + bcrypt (auth, password hashing at 12 salt rounds)

## Security

- Passwords hashed with bcrypt — never stored in plaintext
- All queries use `?` parameterized placeholders — SQL injection protected
- Protected routes require `Authorization: Bearer <token>`
- Admin routes additionally check `req.user.role === 'admin'`