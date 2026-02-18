import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import RegistrarDashboard from './pages/RegistrarDashboard';
import RegistrarCases from './pages/RegistrarCases';
import RegistrarSchedule from './pages/RegistrarSchedule';
import RegistrarAnalytics from './pages/RegistrarAnalytics';
import LawyerDashboard from './pages/LawyerDashboard';
import JudgeDashboard from './pages/JudgeDashboard';
import JudgeDocket from './pages/JudgeDocket';
import LitigantDashboard from './pages/LitigantDashboard';
import GenericCases from './pages/GenericCases';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'admin': return <Navigate to="/admin" replace />;
    case 'registrar': return <Navigate to="/registrar" replace />;
    case 'lawyer': return <Navigate to="/lawyer" replace />;
    case 'judge': return <Navigate to="/judge" replace />;
    case 'litigant': return <Navigate to="/litigant" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 font-sans">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route element={<PrivateRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/" element={<RoleBasedRedirect />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminDashboard />} />

                    {/* Registrar Routes */}
                    <Route path="/registrar" element={<RegistrarDashboard />} />
                    <Route path="/registrar/cases" element={<RegistrarCases />} />
                    <Route path="/registrar/schedule" element={<RegistrarSchedule />} />
                    <Route path="/registrar/analytics" element={<RegistrarAnalytics />} />

                    {/* Lawyer Routes */}
                    <Route path="/lawyer" element={<LawyerDashboard />} />
                    <Route path="/lawyer/cases" element={<GenericCases title="My Pending Cases" />} />
                    <Route path="/lawyer/schedule" element={<RegistrarSchedule />} />

                    {/* Judge Routes */}
                    <Route path="/judge" element={<JudgeDashboard />} />
                    <Route path="/judge/cases" element={<GenericCases title="Assigned Case Files" />} />
                    <Route path="/judge/docket" element={<JudgeDocket />} />

                    {/* Litigant Routes */}
                    <Route path="/litigant" element={<LitigantDashboard />} />
                    <Route path="/litigant/cases" element={<GenericCases title="My Case Proceedings" />} />
                  </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster position="top-right" />
            </div>
          </ThemeProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;