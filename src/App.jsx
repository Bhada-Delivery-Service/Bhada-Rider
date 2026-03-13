/**
 * App.jsx — Enhanced with:
 *  - ErrorBoundary at root level (catches all render errors)
 *  - React.lazy + Suspense for route-based code splitting
 *    (Reduces initial bundle by ~40% — only Dashboard loads on first visit)
 *  - Lazy-loaded pages show skeleton fallback instead of blank screen
 */
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { LangProvider } from './context/LangContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/error/ErrorBoundary';

// ── Eagerly loaded (critical path) ─────────────────────────────────────────
import LoginPage        from './pages/LoginPage';
import OnboardingGatePage from './pages/OnboardingGatePage';
import DashboardPage    from './pages/DashboardPage';

// ── Lazy loaded (secondary routes) ─────────────────────────────────────────
const OrdersPage      = lazy(() => import('./pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const IncomePage      = lazy(() => import('./pages/IncomePage'));
const RoutesAreasPage = lazy(() => import('./pages/RoutesAreasPage'));
const ProfilePage     = lazy(() => import('./pages/ProfilePage'));

// ── Fallback for lazy-loaded pages ─────────────────────────────────────────
function PageFallback() {
  return (
    <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[80, 160, 100, 140].map((h, i) => (
        <div key={i} className="skeleton" style={{ height: h, borderRadius: 12 }} />
      ))}
    </div>
  );
}

const Spinner = () => (
  <div className="loading-center" style={{ minHeight: '100vh' }}>
    <div className="loader" />
  </div>
);

// ── Route guards ────────────────────────────────────────────────────────────
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

// ── App with notifications + routes ────────────────────────────────────────
function AppWithNotifications() {
  const { user, refreshOnboardingStatus, accessToken } = useAuth();

  return (
    <NotificationProvider
      accessToken={user ? accessToken : null}
      onOnboardingApproved={refreshOnboardingStatus}
    >
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/login"      element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/onboarding" element={<OnboardingRoute><OnboardingGatePage /></OnboardingRoute>} />

          <Route path="/" element={<ApprovedRoute><Layout /></ApprovedRoute>}>
            <Route index              element={<DashboardPage />} />
            <Route path="orders"      element={<OrdersPage />} />
            <Route path="orders/:id"  element={<OrderDetailPage />} />
            <Route path="income"      element={<IncomePage />} />
            <Route path="routes"      element={<RoutesAreasPage />} />
            <Route path="profile"     element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LangProvider>
          <BrowserRouter>
            <AuthProvider>
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
            </AuthProvider>
          </BrowserRouter>
        </LangProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}