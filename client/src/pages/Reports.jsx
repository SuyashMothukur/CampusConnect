import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import PageHeader from './PageHeader.jsx';
import Spinner from '../components/Spinner.jsx';

function ReportCard({ title, children }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '1.75rem',
      boxShadow: 'var(--shadow)',
    }}>
      <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border)', background: '#f9fafb' }}>
        <strong style={{ fontSize: '0.95rem' }}>{title}</strong>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function Reports() {
  const [topSkills, setTopSkills] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [activity, setActivity] = useState([]);
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api('/reports/top-skills'),
      api('/reports/provider-ratings'),
      api('/reports/session-activity'),
      api('/reports/flags'),
    ])
      .then(([s, r, a, f]) => {
        setTopSkills(Array.isArray(s) ? s : []);
        setRatings(Array.isArray(r) ? r : []);
        setActivity(Array.isArray(a) ? a : []);
        setFlags(Array.isArray(f) ? f : []);
      })
      .catch((e) => setError(e.message || 'Failed to load reports.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Reports & Analytics" subtitle="Platform-wide data for administrators" />
      {error && <div className="alert alert-error">{error}</div>}

      {/* Report 1: Top Skills by Request Volume */}
      <ReportCard title="📊 Top Skill Categories by Request Volume">
        {topSkills.length === 0 ? (
          <p className="empty-state">No data available.</p>
        ) : (
          <div className="table-wrap" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total Requests</th>
                  <th>Accepted</th>
                  <th>Pending</th>
                  <th>Declined</th>
                </tr>
              </thead>
              <tbody>
                {topSkills.map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.category}</strong></td>
                    <td>{row.total_requests ?? 0}</td>
                    <td><span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>{row.accepted ?? 0}</span></td>
                    <td><span className="badge" style={{ background: '#fef9c3', color: '#854d0e' }}>{row.pending ?? 0}</span></td>
                    <td><span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>{row.declined ?? 0}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>

      {/* Report 2: Provider Ratings */}
      <ReportCard title="⭐ Provider Ratings & Completed Sessions">
        {ratings.length === 0 ? (
          <p className="empty-state">No reviewed providers yet.</p>
        ) : (
          <div className="table-wrap" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Avg Rating</th>
                  <th>Total Reviews</th>
                  <th>Sessions Completed</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.provider}</strong></td>
                    <td>
                      <span style={{ fontWeight: 700, color: row.avg_rating >= 4 ? '#059669' : row.avg_rating >= 3 ? '#d97706' : '#dc2626' }}>
                        {row.avg_rating} / 5
                      </span>
                    </td>
                    <td>{row.total_reviews}</td>
                    <td>{row.sessions_completed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>

      {/* Report 3: Monthly Session Activity */}
      <ReportCard title="📅 Monthly Session Activity">
        {activity.length === 0 ? (
          <p className="empty-state">No session data available.</p>
        ) : (
          <div className="table-wrap" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Sessions</th>
                  <th>Completed</th>
                  <th>Cancelled</th>
                  <th>Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((row, i) => {
                  const rate = row.total_sessions > 0
                    ? Math.round((row.completed / row.total_sessions) * 100)
                    : 0;
                  return (
                    <tr key={i}>
                      <td><strong>{row.month}</strong></td>
                      <td>{row.total_sessions}</td>
                      <td><span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>{row.completed}</span></td>
                      <td><span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>{row.cancelled}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 99 }}>
                            <div style={{ width: `${rate}%`, height: '100%', background: rate >= 70 ? '#059669' : '#d97706', borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', minWidth: 32 }}>{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>

      {/* Report 4: Moderation Flags */}
      <ReportCard title="🚩 Moderation Reports">
        {flags.length === 0 ? (
          <p className="empty-state">No reports filed.</p>
        ) : (
          <div className="table-wrap" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Reporter</th>
                  <th>Subject Type</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Filed</th>
                </tr>
              </thead>
              <tbody>
                {flags.map((r) => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>{r.reporter_name}</td>
                    <td><span className="badge badge-muted">{r.subject_type}</span></td>
                    <td style={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.reason}</td>
                    <td>
                      <span className="badge" style={{
                        background: r.status === 'open' ? '#fef9c3' : r.status === 'resolved' ? '#dcfce7' : '#f3f4f6',
                        color: r.status === 'open' ? '#854d0e' : r.status === 'resolved' ? '#166534' : '#6b7280',
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>
    </>
  );
}
