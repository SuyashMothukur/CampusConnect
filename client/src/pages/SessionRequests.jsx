import { useCallback, useEffect, useState } from 'react';
import { api, formatDate } from '../api/client.js';
import Spinner from '../components/Spinner.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import PageHeader from './PageHeader.jsx';

const STATUSES = ['pending', 'accepted', 'declined', 'cancelled'];

const emptyForm = {
  requester_id: '',
  offering_id: '',
  status: 'pending',
  notes: '',
};

export default function SessionRequests() {
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [offerings, setOfferings] = useState([]);
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
      const [list, u, o] = await Promise.all([
        api('/session-requests'),
        api('/users'),
        api('/offerings'),
      ]);
      setRows(Array.isArray(list) ? list : []);
      setUsers(Array.isArray(u) ? u : []);
      setOfferings(Array.isArray(o) ? o : []);
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
      requester_id: String(row.requester_id),
      offering_id: String(row.offering_id),
      status: row.status || 'pending',
      notes: row.notes || '',
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
      requester_id: Number(form.requester_id),
      offering_id: Number(form.offering_id),
      status: form.status,
      notes: form.notes,
    };
    try {
      if (editingId) {
        await api(`/session-requests/${editingId}`, {
          method: 'PUT',
          body: { status: form.status, notes: form.notes },
        });
        setSuccess('Session request updated.');
      } else {
        await api('/session-requests', { method: 'POST', body: payload });
        setEditingId(null);
        setForm(emptyForm);
        setError('');
        setSuccess('Session request created.');
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
      await api(`/session-requests/${deleteTarget.id}`, { method: 'DELETE' });
      setSuccess('Session request deleted.');
      setDeleteTarget(null);
      if (editingId === deleteTarget.id) startCreate();
      await load();
    } catch (err) {
      setError(err.message || 'Delete failed.');
    } finally {
      setSaving(false);
    }
  }

  if (loading && !rows.length) return <Spinner label="Loading session requests…" />;

  return (
    <div>
      <PageHeader
        title="Session Requests"
        subtitle="Learners request sessions against a skill offering. Status and notes are persisted in MySQL."
      />
      {error ? <div className="alert alert-error">{error}</div> : null}
      {success ? <div className="alert alert-success">{success}</div> : null}

      <div className="page-grid">
        <section className="card-section">
          <div className="section-head">
            <h2>{editingId ? `Edit request #${editingId}` : 'New request'}</h2>
            {editingId ? (
              <button type="button" className="btn btn-secondary" onClick={startCreate}>
                Clear / new
              </button>
            ) : null}
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-row two-col">
              <div className="form-row">
                <label htmlFor="requester_id">Requester *</label>
                <select
                  id="requester_id"
                  required
                  disabled={!!editingId}
                  value={form.requester_id}
                  onChange={(e) => setForm({ ...form, requester_id: e.target.value })}
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
                <label htmlFor="offering_id">Offering *</label>
                <select
                  id="offering_id"
                  required
                  disabled={!!editingId}
                  value={form.offering_id}
                  onChange={(e) => setForm({ ...form, offering_id: e.target.value })}
                >
                  <option value="">Select offering</option>
                  {offerings.map((o) => (
                    <option key={o.id} value={o.id}>
                      #{o.id} — {o.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row two-col">
              <div className="form-row">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {editingId ? 'Save changes' : 'Create request'}
              </button>
            </div>
          </form>
        </section>

        <section className="card-section">
          <div className="section-head">
            <h2>All requests</h2>
          </div>
          {loading ? <Spinner label="Refreshing…" /> : null}
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Requester</th>
                  <th>Offering</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">No session requests yet.</div>
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.requester_name}</td>
                      <td>{r.offering_title}</td>
                      <td>{r.provider_name}</td>
                      <td>
                        <span className="badge">{r.status}</span>
                      </td>
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
        title="Delete session request?"
        message={
          deleteTarget
            ? `Remove request #${deleteTarget.id} (${deleteTarget.offering_title})?`
            : ''
        }
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
