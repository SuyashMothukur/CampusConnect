import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const nav = [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/offerings', label: 'Skill Offerings' },
    { to: '/availability', label: 'Availability' },
    { to: '/session-requests', label: 'Session Requests' },
    { to: '/sessions', label: 'Sessions' },
    { to: '/reviews', label: 'Reviews' },
    // Admin-only links
    ...(user?.role === 'admin'
      ? [
          { to: '/users', label: 'Users' },
          { to: '/reports', label: 'Reports' },
        ]
      : []),
    { to: '/change-password', label: 'Change Password' },
  ];

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">CC</span>
          <div>
            <div className="brand-title">CampusConnect</div>
            <div className="brand-sub">Peer skill exchange</div>
          </div>
        </div>

        <nav className="nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-name">{user?.display_name || user?.email || 'User'}</div>
            <div className="user-role">{user?.role === 'admin' ? '⚙ Admin' : '🎓 Student'}</div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Sign out
          </button>
          <div className="sidebar-copy">© 2026 CampusConnect</div>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>

      <style>{`
        .app-shell {
          display: flex;
          min-height: 100vh;
        }
        .sidebar {
          width: 240px;
          flex-shrink: 0;
          background: var(--sidebar);
          color: var(--sidebar-text);
          padding: 1.25rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0 0.5rem 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .brand-mark {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
        }
        .brand-title { font-weight: 700; font-size: 1rem; }
        .brand-sub { font-size: 0.75rem; color: var(--sidebar-muted); }
        .nav {
          display: flex; flex-direction: column;
          gap: 0.15rem; flex: 1;
        }
        .nav-link {
          padding: 0.5rem 0.65rem;
          border-radius: 8px;
          color: var(--sidebar-muted);
          text-decoration: none;
          font-size: 0.9rem; font-weight: 500;
        }
        .nav-link:hover {
          background: rgba(255,255,255,0.06);
          color: var(--sidebar-text);
          text-decoration: none;
        }
        .nav-link.active {
          background: rgba(59,130,246,0.2);
          color: #fff;
        }
        .sidebar-footer {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .user-info { padding: 0 0.5rem; }
        .user-name {
          font-size: 0.875rem; font-weight: 600;
          color: var(--sidebar-text);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .user-role { font-size: 0.75rem; color: var(--sidebar-muted); margin-top: 0.15rem; }
        .sidebar-copy { font-size: 0.65rem; color: var(--sidebar-muted); opacity: 0.5; text-align: center; padding: 0 0.5rem; }
        .btn-logout {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--sidebar-muted);
          border-radius: 8px;
          padding: 0.45rem 0.65rem;
          font-size: 0.8rem; font-weight: 500;
          text-align: left; width: 100%;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-logout:hover {
          background: rgba(239,68,68,0.15);
          color: #fca5a5;
          border-color: rgba(239,68,68,0.3);
        }
        .main {
          flex: 1;
          padding: 1.75rem 2rem 2.5rem;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }
        @media (max-width: 900px) {
          .app-shell { flex-direction: column; }
          .sidebar { width: 100%; flex-direction: row; flex-wrap: wrap; align-items: center; }
          .nav { flex-direction: row; flex-wrap: wrap; }
          .sidebar-footer { flex-direction: row; align-items: center; border-top: none; padding-top: 0; }
        }
      `}</style>
    </div>
  );
}
