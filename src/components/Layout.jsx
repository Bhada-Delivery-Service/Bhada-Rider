import React, { useEffect } from 'react';
import { Outlet, NavLink,useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, MapPin, User, Bike, Bell, IndianRupee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useLang } from '../context/LangContext';
import NotificationDrawer from '../components/NotificationDrawer';
import NewOrderAlert from '../components/order/NewOrderAlert';
import { unlockAudio } from '../services/soundService';


export default function Layout() {
  const { user, rider } = useAuth();
  const { unseenCount, openDrawer, alertOrder, dismissAlert } = useNotifications();
  const { t } = useLang();
  const navigate = useNavigate();
  const initials = rider?.firstName?.[0] || rider?.name?.[0] || '?';

  // Unlock Web Audio on the first user gesture anywhere in the app.
  // Browsers block AudioContext until a tap/click happens — this ensures
  // the ring works even when triggered later by a WebSocket event.
  useEffect(() => {
    const unlock = () => { unlockAudio(); };
    window.addEventListener('click',      unlock, { once: true, capture: true });
    window.addEventListener('touchstart', unlock, { once: true, capture: true });
    return () => {
      window.removeEventListener('click',      unlock, { capture: true });
      window.removeEventListener('touchstart', unlock, { capture: true });
    };
  }, []);

  const navItems = [
    { to: '/',        icon: LayoutDashboard, label: t('nav_home'),    exact: true },
    { to: '/orders',  icon: Package,         label: t('nav_orders') },
    { to: '/income',  icon: IndianRupee,     label: t('nav_income') },
    { to: '/routes',  icon: MapPin,          label: t('nav_routes') },
    { to: '/profile', icon: User,            label: t('nav_profile') },
  ];

  return (
    <div className="app-shell">

      {/* ── Topbar ── */}
      <header className="topbar">
        {/* Logo mark */}
        <div className="topbar-logo-mark">
          <Bike size={17} strokeWidth={2.5} />
        </div>

        <div className="flex-1">
          <div className="topbar-title">Bhada Rider</div>
          {user?.phoneNumber && (
            <div className="topbar-sub">{user.phoneNumber}</div>
          )}
        </div>

        {/* Notification bell */}
        <button
          onClick={openDrawer}
          aria-label="Notifications"
          style={{
            position: 'relative',
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)',
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-1)',
            transition: 'all var(--transition)',
            marginRight: 8,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--bg-3)';
            e.currentTarget.style.color = 'var(--text-0)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--bg-2)';
            e.currentTarget.style.color = 'var(--text-1)';
          }}
        >
          <Bell size={17} strokeWidth={2} />
          {unseenCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              minWidth: 17, height: 17, borderRadius: 99,
              background: 'var(--red)',
              color: '#fff',
              fontSize: 9, fontWeight: 800,
              display: 'grid', placeItems: 'center', padding: '0 3px',
              border: '2px solid var(--bg-1)',
              fontFamily: 'var(--font-mono)',
            }}>
              {unseenCount > 9 ? '9+' : unseenCount}
            </span>
          )}
        </button>

        {/* Avatar */}
  {/* Avatar */}
<NavLink 
  to="/profile" 
  style={{ 
    textDecoration: 'none',
    position: 'relative',
    zIndex: 9999,
  }}
>
  <div style={{
    width: 34, height: 34,
    background: 'var(--accent-dim)',
    border: '1.5px solid rgba(30,198,116,0.25)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 800,
    color: 'var(--accent)',
    flexShrink: 0,
    letterSpacing: '-0.02em',
    cursor: 'pointer',
  }}>
    {initials.toUpperCase()}
  </div>
</NavLink>
      </header>

      {/* ── Page ── */}
      <main className="page-content">
        <Outlet />
      </main>

      {/* ── Bottom Nav — Blinkit pill-active style ── */}
      <nav className="bottom-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <NotificationDrawer />
      {alertOrder && <NewOrderAlert order={alertOrder} onDismiss={dismissAlert} />}
    </div>
  );
}