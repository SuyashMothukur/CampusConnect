import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client.js';
import Spinner from '../components/Spinner.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import PageHeader from './PageHeader.jsx';

const emptyForm = {
  user_id: '',
  category_id: '',
  title: '',
  description: '',
  rate_per_hour: '',
  is_active: true,
};

export default function SkillOfferings() {
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
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
      const [list, u, c] = await Promise.all([
        api('/offerings'),
        api('/users'),
        api('/categories'),
      ]);
      setRows(Array.isArray(list) ? list : []);
      setUsers(Array.isArray(u) ? u : []);
      setCategories(Array.isArray(c) ? c : []);
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
      user_id: String(row.user_id),
      category_id: String(row.category_id),
      title: row.title || '',
      description: row.description || '',
      rate_per_hour:
        row.rate_per_hour !== null && row.rate_per_hour !== undefined
          ? String(row.rate_per_hour)
          : '',
      is_active: !!row.is_active,
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
      user_id: Number(form.user_id),
      category_id: Number(form.category_id),
      title: form.title,
      description: form.description,
      rate_per_hour: form.rate_per_hour === '' ? null : Number(form.rate_per_hour),
      is_active: form.is_active,
    };
    try {
      if (editingId) {
        await api(`/offerings/${editingId}`, { method: 'PUT', body: payload });
        setSuccess('Offering updated.');
      } else {
        await api('/offerings', { method: 'POST', body: payload });
        setEditingId(null);
        setForm(emptyForm);
        setError('');
        setSuccess('Offering created.');
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
      await api(`/offerings/${deleteTarget.id}`, { method: 'DELETE' });
      setSuccess('Offering deleted.');
      setDeleteTarget(null);
      if (editingId === deleteTarget.id) startCreate();
      await load();
    } catch (err) {
      setError(err.message || 'Delete failed.');
    } finally {
      setSaving(false);
    }
  }

  if (loading && !rows.length) return <Spinner label="Loading offerings…" />;

  return (
    <div>
      <PageHeader
        title="Skill Offerings"
        subtitle="Providers list what they can teach. Linked to users and categories in MySQL."
      />
      {error ? <div className="alert alert-error">{error}</div> : null}
      {success ? <div className="alert alert-success">{success}</div> : null}

      <div className="page-grid">
        <section className="card-section">
          <div className="section-head">
            <h2>{editingId ? `Edit offering #${editingId}` : 'New offering'}</h2>
            {editingId ? (
              <button type="button" className="btn btn-secondary" onClick={startCreate}>
                Clear / new
              </button>
            ) : null}
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-row two-col">
              <div className="form-row">
                <label htmlFor="user_id">Provider (user) *</label>
                <select
                  id="user_id"
                  required
                  value={form.user_id}
                  onChange={(e) => setForm({ ...form, user_id: e.target.value })}
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
                <label htmlFor="category_id">Category *</label>
                <select
                  id="category_id"
                  required
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="form-row two-col">
              <div className="form-row">
                <label htmlFor="rate">Rate / hour (optional)</label>
                <input
                  id="rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.rate_per_hour}
                  onChange={(e) => setForm({ ...form, rate_per_hour: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label htmlFor="active">Active</label>
                <select
                  id="active"
                  value={form.is_active ? '1' : '0'}
                  onChange={(e) => setForm({ ...form, is_active: e.target.value === '1' })}
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {editingId ? 'Save changes' : 'Create offering'}
              </button>
            </div>
          </form>
        </section>

        <section className="card-section">
          <div className="section-head">
            <h2>All offerings</h2>
          </div>
          {loading ? <Spinner label="Refreshing…" /> : null}
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Provider</th>
                  <th>Category</th>
                  <th>Rate</th>
                  <th>Active</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">No offerings yet.</div>
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.title}</td>
                      <td>{r.provider_name}</td>
                      <td>{r.category_name}</td>
                      <td>
                        {r.rate_per_hour !== null && r.rate_per_hour !== undefined
                          ? `$${Number(r.rate_per_hour).toFixed(2)}`
                          : '—'}
                      </td>
                      <td>{r.is_active ? 'Yes' : 'No'}</td>
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
        title="Delete offering?"
        message={
          deleteTarget
            ? `Remove “${deleteTarget.title}”? Session requests referencing it may be removed by cascade rules.`
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
