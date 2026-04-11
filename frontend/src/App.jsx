import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import SkillOfferings from './pages/SkillOfferings.jsx';
import Availability from './pages/Availability.jsx';
import SessionRequests from './pages/SessionRequests.jsx';
import SessionsPage from './pages/SessionsPage.jsx';
import Reviews from './pages/Reviews.jsx';
import Reports from './pages/Reports.jsx';
import ChangePassword from './pages/ChangePassword.jsx';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '2rem', color: 'var(--muted)' }}>Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user } = useAuth();
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="offerings" element={<SkillOfferings />} />
        <Route path="availability" element={<Availability />} />
        <Route path="session-requests" element={<SessionRequests />} />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="change-password" element={<ChangePassword />} />

        {/* Admin-only routes */}
        <Route path="users" element={<RequireAdmin><Users /></RequireAdmin>} />
        <Route path="reports" element={<RequireAdmin><Reports /></RequireAdmin>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
