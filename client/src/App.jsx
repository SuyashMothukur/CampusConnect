import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import SkillOfferings from './pages/SkillOfferings.jsx';
import Availability from './pages/Availability.jsx';
import SessionRequests from './pages/SessionRequests.jsx';
import SessionsPage from './pages/SessionsPage.jsx';
import Reviews from './pages/Reviews.jsx';
import Reports from './pages/Reports.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="offerings" element={<SkillOfferings />} />
        <Route path="availability" element={<Availability />} />
        <Route path="session-requests" element={<SessionRequests />} />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
