import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handle(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
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
            <div style={styles.brandSub}>Peer skill exchange</div>
          </div>
        </div>

        <h2 style={styles.heading}>Sign in to your account</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit} className="form-grid">
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handle}
              placeholder="you@vt.edu"
            />
          </div>
          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handle}
              placeholder="••••••••"
            />
          </div>
          <div className="form-actions" style={{ marginTop: '0.25rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/signup">Sign up</Link>
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
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
  },
  brandMark: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.9rem',
    color: '#fff',
    flexShrink: 0,
  },
  brandTitle: { fontWeight: '700', fontSize: '1.1rem' },
  brandSub: { fontSize: '0.75rem', color: 'var(--muted)' },
  heading: { margin: 0, fontSize: '1.2rem', fontWeight: '700' },
  footer: { margin: 0, textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted)' },
};
