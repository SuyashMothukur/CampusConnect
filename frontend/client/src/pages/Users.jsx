import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import Spinner from '../components/Spinner.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import PageHeader from './PageHeader.jsx';

const emptyForm = {
  email: '',
  password: '',
  display_name: '',
  bio: '',
  campus: '',
  major: '',
  role: 'student',
};

export default function Users() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api('/users');
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((u) => {
      const email = (u.email || '').toLowerCase();
      const name = (u.display_name || '').toLowerCase();
      const campus = (u.campus || '').toLowerCase();
      const major = (u.major || '').toLowerCase();
      return (
        email.includes(q) ||
        name.includes(q) ||
        campus.includes(q) ||
        major.includes(q)
      );
    });
  }, [rows, search]);

  function startEdit(u) {
    setEditingId(u.id);
    setForm({
      email: u.email || '',
      password: '',
      display_name: u.display_name || '',
      bio: u.bio || '',
      campus: u.campus || '',
      major: u.major || '',
      role: u.role === 'admin' ? 'admin' : 'student',
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
    try {
      if (editingId) {
        const body = {
          email: form.email,
          display_name: form.display_name,
          bio: form.bio,
          campus: form.campus,
          major: form.major,
          role: form.role,
        };
        if (form.password) body.password = form.password;
        await api(`/users/${editingId}`, { method: 'PUT', body });
        setSuccess('User updated successfully.');
      } else {
        await api('/users', {
          method: 'POST',
          body: {
            email: form.email,
            password: form.password,
            display_name: form.display_name,
            bio: form.bio,
            campus: form.campus,
            major: form.major,
            role: form.role,
          },
        });
        setSuccess('User created successfully.');
        setForm(emptyForm);
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
      await api(`/users/${deleteTarget.id}`, { method: 'DELETE' });
      setSuccess('User deleted.');
      setDeleteTarget(null);
      if (editingId === deleteTarget.id) startCreate();
      await load();
    } catch (err) {
      setError(err.message || 'Delete failed.');
    } finally {
      setSaving(false);
    }
  }

  if (loading && !rows.length) return <Spinner label="Loading users…" />;

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Create, view, edit, and delete user accounts and profiles. Data is stored in MySQL."
      />

      {error ? <div className="alert alert-error">{error}</div> : null}
      {success ? <div className="alert alert-success">{success}</div> : null}

      <div className="page-grid">
        <section className="card-section">
          <div className="section-head">
            <h2>{editingId ? `Edit user #${editingId}` : 'New user'}</h2>
            {editingId ? (
              <button type="button" className="btn btn-secondary" onClick={startCreate}>
                Clear / new
              </button>
            ) : null}
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-row two-col">
              <div className="form-row">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="form-row">
                <label htmlFor="password">{editingId ? 'New password (optional)' : 'Password *'}</label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editingId}
                  autoComplete="new-password"
                />
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="display_name">Display name *</label>
              <input
                id="display_name"
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                required
              />
            </div>
            <div className="form-row two-col">
              <div className="form-row">
                <label htmlFor="campus">Campus</label>
                <input
                  id="campus"
                  value={form.campus}
                  onChange={(e) => setForm({ ...form, campus: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label htmlFor="major">Major</label>
                <input
                  id="major"
                  value={form.major}
                  onChange={(e) => setForm({ ...form, major: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="bio">Bio</label>
              <textarea id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
            <div className="form-row">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="student">student</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {editingId ? 'Save changes' : 'Create user'}
              </button>
            </div>
          </form>
        </section>

        <section className="card-section">
          <div className="section-head">
            <h2>Directory</h2>
            <input
              type="search"
              className="search-input"
              placeholder="Search email, name, campus, major…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Filter users"
            />
          </div>
          {loading ? <Spinner label="Refreshing…" /> : null}
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Campus</th>
                  <th>Role</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">No users match your filter.</div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.email}</td>
                      <td>{u.display_name || '—'}</td>
                      <td>{u.campus || '—'}</td>
                      <td>
                        <span className="badge badge-muted">{u.role}</span>
                      </td>
                      <td className="cell-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => startEdit(u)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => setDeleteTarget(u)}
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
        title="Delete user?"
        message={
          deleteTarget
            ? `This will remove ${deleteTarget.email} and related profile data (cascades where configured).`
            : ''
        }
        confirmLabel="Delete"
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
        .search-input {
          min-width: 220px;
          padding: 0.45rem 0.65rem;
          border: 1px solid var(--border);
          border-radius: 8px;
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
