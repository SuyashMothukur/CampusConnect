import { useCallback, useEffect, useState } from 'react';
import { api, formatDate } from '../api/client.js';
import Spinner from '../components/Spinner.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import PageHeader from './PageHeader.jsx';

const emptyForm = {
  session_id: '',
  reviewer_id: '',
  reviewee_id: '',
  rating: '5',
  comment: '',
};

export default function Reviews() {
  const [rows, setRows] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [list, sess, u] = await Promise.all([
        api('/reviews'),
        api('/sessions'),
        api('/users'),
      ]);
      setRows(Array.isArray(list) ? list : []);
      setSessions(Array.isArray(sess) ? sess : []);
      setUsers(Array.isArray(u) ? u : []);
    } catch (e) {
      setError(e.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(row) {
    setEditingId(row.id);
    setForm({
      session_id: String(row.session_id),
      reviewer_id: String(row.reviewer_id),
      reviewee_id: String(row.reviewee_id),
      rating: String(row.rating),
      comment: row.comment || '',
    });
    setSuccess('');
    setError('');
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setSuccess('');
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    const payload = {
      session_id: Number(form.session_id),
      reviewer_id: Number(form.reviewer_id),
      reviewee_id: Number(form.reviewee_id),
      rating: Number(form.rating),
      comment: form.comment,
    };
    try {
      if (editingId) {
        await api(`/reviews/${editingId}`, { method: 'PUT', body: payload });
        setSuccess('Review updated.');
      } else {
        await api('/reviews', { method: 'POST', body: payload });
        setEditingId(null);
        setForm(emptyForm);
        setError('');
        setSuccess('Review created.');
      }
      await load();
    } catch (err) {
      setError(err.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api(`/reviews/${deleteTarget.id}`, { method: 'DELETE' });
      setSuccess('Review deleted.');
      setDeleteTarget(null);
      if (editingId === deleteTarget.id) startCreate();
      await load();
    } catch (err) {
      setError(err.message || 'Delete failed.');
    } finally {
      setSaving(false);
    }
  }

  if (loading && !rows.length) return <Spinner label="Loading reviews…" />;

  return (
    <div>
      <PageHeader
        title="Reviews"
        subtitle="Post-session feedback linked to a session row. Full CRUD against MySQL."
      />
      {error ? <div className="alert alert-error">{error}</div> : null}
      {success ? <div className="alert alert-success">{success}</div> : null}

      <div className="page-grid">
        <section className="card-section">
          <div className="section-head">
            <h2>{editingId ? `Edit review #${editingId}` : 'New review'}</h2>
            {editingId ? (
              <button type="button" className="btn btn-secondary" onClick={startCreate}>
                Clear / new
              </button>
            ) : null}
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="session_id">Session *</label>
              <select
                id="session_id"
                required
                value={form.session_id}
                onChange={(e) => setForm({ ...form, session_id: e.target.value })}
              >
                <option value="">Select session</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.id} — {s.offering_title} @ {formatDate(s.scheduled_at)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row two-col">
              <div className="form-row">
                <label htmlFor="reviewer_id">Reviewer *</label>
                <select
                  id="reviewer_id"
                  required
                  value={form.reviewer_id}
                  onChange={(e) => setForm({ ...form, reviewer_id: e.target.value })}
                >
                  <option value="">Select user</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      #{u.id} — {u.display_name || u.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="reviewee_id">Reviewee *</label>
                <select
                  id="reviewee_id"
                  required
                  value={form.reviewee_id}
                  onChange={(e) => setForm({ ...form, reviewee_id: e.target.value })}
                >
                  <option value="">Select user</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      #{u.id} — {u.display_name || u.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="rating">Rating (1–5) *</label>
              <select
                id="rating"
                required
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={String(n)}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {editingId ? 'Save changes' : 'Create review'}
              </button>
            </div>
          </form>
        </section>

        <section className="card-section">
          <div className="section-head">
            <h2>All reviews</h2>
          </div>
          {loading ? <Spinner label="Refreshing…" /> : null}
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Session</th>
                  <th>Reviewer</th>
                  <th>Reviewee</th>
                  <th>Rating</th>
                  <th>When</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">No reviews yet. Create a session in the DB or use seeded data.</div>
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>#{r.session_id}</td>
                      <td>{r.reviewer_name}</td>
                      <td>{r.reviewee_name}</td>
                      <td>{r.rating}</td>
                      <td>{formatDate(r.created_at)}</td>
                      <td className="cell-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => startEdit(r)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => setDeleteTarget(r)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete review?"
        message={deleteTarget ? `Remove review #${deleteTarget.id}?` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <style>{`
        .page-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .card-section {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.15rem 1.25rem;
          box-shadow: var(--shadow);
        }
        .section-head {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .section-head h2 {
          margin: 0;
          font-size: 1.05rem;
        }
        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }
        @media (max-width: 640px) {
          .two-col {
            grid-template-columns: 1fr;
          }
        }
        .cell-actions {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}
