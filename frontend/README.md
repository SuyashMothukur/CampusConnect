# Frontend

Client-side code is in `../client/`.

## Structure

**`client/src/pages/`** — Login, Signup, Dashboard, SkillOfferings, SessionRequests, SessionsPage, Availability, Reviews, Reports, Users, ChangePassword

**`client/src/context/AuthContext.jsx`** — JWT token state, login/logout helpers

**`client/src/api/client.js`** — fetch wrapper with automatic token attachment

**`client/src/components/`** — ConfirmDialog, Spinner (shared UI)

**`client/src/layouts/AppLayout.jsx`** — Sidebar navigation with role-based visibility

## Stack

- React 18 + Vite
- React Router v6
- AuthContext for JWT state management
- Native fetch() with Bearer token headers

## Pages & Access

| Page | Route | Access |
|---|---|---|
| Login / Signup | `/login`, `/signup` | Public |
| Dashboard | `/` | All users |
| Skill Offerings | `/offerings` | All users |
| Session Requests | `/session-requests` | All users |
| Sessions | `/sessions` | All users |
| Availability | `/availability` | All users |
| Reviews | `/reviews` | All users |
| Change Password | `/change-password` | All users |
| Users | `/users` | Admin only |
| Reports | `/reports` | Admin only |

## Running

```bash
cd client && npm install && npm run dev
```

Runs at `http://localhost:5173`, proxies `/api` to Express on port 5000.