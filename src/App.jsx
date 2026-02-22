import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import OnboardingGatePage from './pages/OnboardingGatePage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import RoutesAreasPage from './pages/RoutesAreasPage';
import IncomePage from './pages/IncomePage';

const Spinner = () => (
  <div className="loading-center" style={{ minHeight: '100vh' }}>
    <div className="loader" />
  </div>
);

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? <Navigate to="/" replace /> : children;
}

function ApprovedRoute({ children }) {
  const { user, loading, isApproved } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isApproved) return <Navigate to="/onboarding" replace />;
  return children;
}

function OnboardingRoute({ children }) {
  const { user, loading, isApproved } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (isApproved) return <Navigate to="/" replace />;
  return children;
}

function AppWithNotifications() {
  const { user, refreshOnboardingStatus, accessToken } = useAuth();

  return (
    <NotificationProvider
      accessToken={user ? accessToken : null}
      onOnboardingApproved={refreshOnboardingStatus}
    >
      <Routes>
        {/* Public */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        {/* Onboarding gate */}
        <Route path="/onboarding" element={<OnboardingRoute><OnboardingGatePage /></OnboardingRoute>} />

        {/* Main app — approved riders only */}
        <Route path="/" element={<ApprovedRoute><Layout /></ApprovedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="orders"     element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="income"     element={<IncomePage />} />
          <Route path="routes"     element={<RoutesAreasPage />} />
          <Route path="profile"    element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NotificationProvider>
  );
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
            error:   { iconTheme: { primary: '#ff4d6d', secondary: '#05080f' } },
          }}
        />
        <AppWithNotifications />
      </BrowserRouter>
    </AuthProvider>
  );
}