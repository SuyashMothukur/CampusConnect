# Frontend

Client-side code is in `../client/`.

## Structure
client/src/
├── pages/       ← Login, Signup, Dashboard, SkillOfferings, SessionRequests,
│                   SessionsPage, Availability, Reviews, Reports, Users, ChangePassword
├── context/     ← AuthContext.jsx (JWT state, login/logout)
├── api/         ← client.js (fetch wrapper with auto token attachment)
├── components/  ← ConfirmDialog, Spinner
└── layouts/     ← AppLayout.jsx (sidebar, role-based nav)

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
# Runs at http://localhost:5173, proxies /api to Express on :5000
```