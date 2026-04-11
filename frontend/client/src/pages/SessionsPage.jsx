import { useEffect, useState } from 'react';
import { api, formatDate } from '../api/client.js';
import Spinner from '../components/Spinner.jsx';
import PageHeader from './PageHeader.jsx';

export default function SessionsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api('/sessions');
        if (!cancelled) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load sessions.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading && !rows.length) return <Spinner label="Loading sessions…" />;

  return (
    <div>
      <PageHeader
        title="Sessions"
        subtitle="Scheduled sessions created from accepted requests. Listed from MySQL for demo visibility."
      />
      {error ? <div className="alert alert-error">{error}</div> : null}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Offering</th>
              <th>Scheduled</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Request status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">No sessions yet.</div>
                </td>
              </tr>
            ) : (
              rows.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.offering_title}</td>
                  <td>{formatDate(s.scheduled_at)}</td>
                  <td>{s.duration_minutes} min</td>
                  <td>
                    <span className="badge">{s.status}</span>
                  </td>
                  <td>
                    <span className="badge badge-muted">{s.request_status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
