import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PageHeader from './PageHeader.jsx';

export default function ChangePassword() {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handle(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.new_password !== form.confirm) { setError('New passwords do not match.'); return; }
    if (form.new_password.length < 8) { setError('New password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await changePassword(form.current_password, form.new_password);
      setSuccess('Password updated successfully.');
      setForm({ current_password: '', new_password: '', confirm: '' });
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="Change Password" subtitle="Update your account password" />
      <div style={{ maxWidth: '440px' }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <form onSubmit={submit} className="form-grid">
            <div className="form-row">
              <label>Current Password</label>
              <input name="current_password" type="password" required value={form.current_password} onChange={handle} placeholder="••••••••" />
            </div>
            <div className="form-row">
              <label>New Password</label>
              <input name="new_password" type="password" required value={form.new_password} onChange={handle} placeholder="Min 8 characters" />
            </div>
            <div className="form-row">
              <label>Confirm New Password</label>
              <input name="confirm" type="password" required value={form.confirm} onChange={handle} placeholder="Repeat new password" />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
