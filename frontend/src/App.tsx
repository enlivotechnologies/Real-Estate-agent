import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import TodaysCalls from './pages/agent/TodaysCalls';
import LeadDetail from './pages/agent/LeadDetail';
import CreateLead from './pages/agent/CreateLead';
import AllLeads from './pages/agent/AllLeads';
import Notifications from './pages/agent/Notifications';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLeadsList from './pages/admin/AdminLeadsList';
import AdminNotifications from './pages/admin/AdminNotifications';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* Agent Routes - Direct to Today's Calls */}
          <Route
            path="/agent"
            element={
              <PrivateRoute allowedRoles={['AGENT', 'ADMIN']}>
                <TodaysCalls />
              </PrivateRoute>
            }
          />
          <Route
            path="/agent/today"
            element={
              <PrivateRoute allowedRoles={['AGENT', 'ADMIN']}>
                <TodaysCalls />
              </PrivateRoute>
            }
          />
          <Route
            path="/agent/lead/new"
            element={
              <PrivateRoute allowedRoles={['AGENT', 'ADMIN']}>
                <CreateLead />
              </PrivateRoute>
            }
          />
          <Route
            path="/agent/lead/:id"
            element={
              <PrivateRoute allowedRoles={['AGENT', 'ADMIN']}>
                <LeadDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/agent/leads"
            element={
              <PrivateRoute allowedRoles={['AGENT', 'ADMIN']}>
                <AllLeads />
              </PrivateRoute>
            }
          />
          <Route
            path="/agent/notifications"
            element={
              <PrivateRoute allowedRoles={['AGENT', 'ADMIN']}>
                <Notifications />
              </PrivateRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminLeadsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminNotifications />
              </PrivateRoute>
            }
          />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
