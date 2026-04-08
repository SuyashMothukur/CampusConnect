import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const empty = { email: '', password: '', confirm: '', display_name: '', campus: '', major: '', bio: '' };

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handle(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await signup({
        email: form.email,
        password: form.password,
        display_name: form.display_name,
        campus: form.campus,
        major: form.major,
        bio: form.bio,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <span style={styles.brandMark}>CC</span>
          <div>
            <div style={styles.brandTitle}>CampusConnect</div>
            <div style={styles.brandSub}>Create your account</div>
          </div>
        </div>

        <h2 style={styles.heading}>Join CampusConnect</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit} className="form-grid">
          <div className="form-row">
            <label>Email *</label>
            <input name="email" type="email" required value={form.email} onChange={handle} placeholder="you@vt.edu" />
          </div>
          <div className="form-row">
            <label>Display Name *</label>
            <input name="display_name" required value={form.display_name} onChange={handle} placeholder="Jane Smith" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-row">
              <label>Password *</label>
              <input name="password" type="password" required value={form.password} onChange={handle} placeholder="Min 8 chars" />
            </div>
            <div className="form-row">
              <label>Confirm Password *</label>
              <input name="confirm" type="password" required value={form.confirm} onChange={handle} placeholder="Repeat password" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-row">
              <label>Campus</label>
              <input name="campus" value={form.campus} onChange={handle} placeholder="Virginia Tech" />
            </div>
            <div className="form-row">
              <label>Major</label>
              <input name="major" value={form.major} onChange={handle} placeholder="Computer Science" />
            </div>
          </div>
          <div className="form-row">
            <label>Bio</label>
            <textarea name="bio" value={form.bio} onChange={handle} placeholder="Tell others a little about yourself…" />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </div>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    padding: '1.5rem',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    boxShadow: '0 4px 24px rgba(15,23,42,0.08)',
    padding: '2rem',
    width: '100%',
    maxWidth: '480px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '0.65rem' },
  brandMark: {
    width: '40px', height: '40px', borderRadius: '10px',
    background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '0.9rem', color: '#fff', flexShrink: 0,
  },
  brandTitle: { fontWeight: '700', fontSize: '1.1rem' },
  brandSub: { fontSize: '0.75rem', color: 'var(--muted)' },
  heading: { margin: 0, fontSize: '1.2rem', fontWeight: '700' },
  footer: { margin: 0, textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted)' },
};
