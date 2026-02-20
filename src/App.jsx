import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import OnboardingGatePage from './pages/OnboardingGatePage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import RoutesAreasPage from './pages/RoutesAreasPage';

const Spinner = () => (
  <div className="loading-center" style={{ minHeight: '100vh' }}>
    <div className="loader" />
  </div>
);

// Not logged in → /login
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
}

// Logged in → /  (or /onboarding)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? <Navigate to="/" replace /> : children;
}

// Logged in + NOT approved → /onboarding
// Logged in + approved     → allow through
function ApprovedRoute({ children }) {
  const { user, loading, isApproved } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isApproved) return <Navigate to="/onboarding" replace />;
  return children;
}

// Logged in + already approved → redirect away from onboarding
function OnboardingRoute({ children }) {
  const { user, loading, isApproved } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (isApproved) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#131929',
              color: '#f0f4ff',
              border: '1px solid rgba(255,255,255,0.07)',
              fontFamily: "'Inter', sans-serif",
              fontSize: '13.5px',
              maxWidth: '360px',
            },
            success: { iconTheme: { primary: '#00e5a0', secondary: '#05080f' } },
            error: { iconTheme: { primary: '#ff4d6d', secondary: '#05080f' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

          {/* Onboarding gate — logged in but not approved */}
          <Route path="/onboarding" element={<OnboardingRoute><OnboardingGatePage /></OnboardingRoute>} />

          {/* Main app — only for approved riders */}
          <Route path="/" element={<ApprovedRoute><Layout /></ApprovedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="routes" element={<RoutesAreasPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

