import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import Spinner from '../components/Spinner.jsx';
import PageHeader from './PageHeader.jsx';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Availability() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api('/availability');
        if (!cancelled) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load availability.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading && !rows.length) return <Spinner label="Loading availability…" />;

  return (
    <div>
      <PageHeader
        title="Availability"
        subtitle="Weekly time windows stored per user. Read-only in this MVP; manage slots directly in MySQL or extend the API later."
      />
      {error ? <div className="alert alert-error">{error}</div> : null}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Day</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">No availability rows.</div>
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.user_name}</td>
                  <td>{DAYS[r.day_of_week] ?? r.day_of_week}</td>
                  <td>{String(r.start_time).slice(0, 5)}</td>
                  <td>{String(r.end_time).slice(0, 5)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
