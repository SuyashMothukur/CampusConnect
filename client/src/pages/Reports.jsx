import { useEffect, useState } from 'react';
import { api, formatDate } from '../api/client.js';
import Spinner from '../components/Spinner.jsx';
import PageHeader from './PageHeader.jsx';

export default function Reports() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api('/reports');
        if (!cancelled) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load reports.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading && !rows.length) return <Spinner label="Loading reports…" />;

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Moderation queue (subject type + id). Read-only list for the demo; wire create/update APIs when needed."
      />
      {error ? <div className="alert alert-error">{error}</div> : null}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Reporter</th>
              <th>Subject</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">No reports.</div>
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.reporter_name}</td>
                  <td>
                    {r.subject_type} #{r.subject_id}
                  </td>
                  <td style={{ maxWidth: 280 }}>{r.reason}</td>
                  <td>
                    <span className="badge">{r.status}</span>
                  </td>
                  <td>{formatDate(r.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
