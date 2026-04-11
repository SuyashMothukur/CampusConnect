import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import Spinner from '../components/Spinner.jsx';
import PageHeader from './PageHeader.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api('/stats');
        if (!cancelled) setStats(data);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load stats.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Spinner label="Loading dashboard…" />;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Summary counts from the live MySQL database — refresh after CRUD operations to verify changes."
      />
      {error ? <div className="alert alert-error">{error}</div> : null}
      {stats ? (
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-label">Users</div>
            <div className="stat-value">{stats.total_users}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Skill offerings</div>
            <div className="stat-value">{stats.total_offerings}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Session requests</div>
            <div className="stat-value">{stats.total_session_requests}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Reviews</div>
            <div className="stat-value">{stats.total_reviews}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Scheduled sessions</div>
            <div className="stat-value">{stats.total_sessions}</div>
          </div>
        </div>
      ) : null}
      <style>{`
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1rem;
        }
        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem 1.1rem;
          box-shadow: var(--shadow);
        }
        .stat-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 0.35rem;
          color: var(--text);
        }
      `}</style>
    </div>
  );
}
