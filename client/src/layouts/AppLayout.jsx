import { NavLink, Outlet } from 'react-router-dom';

const nav = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/users', label: 'Users' },
  { to: '/offerings', label: 'Skill Offerings' },
  { to: '/availability', label: 'Availability' },
  { to: '/session-requests', label: 'Session Requests' },
  { to: '/sessions', label: 'Sessions' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/reports', label: 'Reports' },
];

export default function AppLayout() {
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
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .brand-mark {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
        }
        .brand-title {
          font-weight: 700;
          font-size: 1rem;
        }
        .brand-sub {
          font-size: 0.75rem;
          color: var(--sidebar-muted);
        }
        .nav {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .nav-link {
          padding: 0.5rem 0.65rem;
          border-radius: 8px;
          color: var(--sidebar-muted);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.06);
          color: var(--sidebar-text);
          text-decoration: none;
        }
        .nav-link.active {
          background: rgba(59, 130, 246, 0.2);
          color: #fff;
        }
        .main {
          flex: 1;
          padding: 1.75rem 2rem 2.5rem;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }
        @media (max-width: 900px) {
          .app-shell {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
          }
          .nav {
            flex-direction: row;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}
