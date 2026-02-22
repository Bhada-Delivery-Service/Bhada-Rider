import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, MapPin, User, Bike, Bell, IndianRupee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDrawer from '../components/NotificationDrawer';

const navItems = [
  { to: '/',       icon: LayoutDashboard, label: 'Home',   exact: true },
  { to: '/orders', icon: Package,         label: 'Orders' },
  { to: '/income', icon: IndianRupee,     label: 'Income' },
  { to: '/routes', icon: MapPin,          label: 'Routes' },
  { to: '/profile',icon: User,            label: 'Profile' },
];

export default function Layout() {
  const { user } = useAuth();
  const { unseenCount, openDrawer } = useNotifications();

  return (
    <div className="app-shell">

      {/* ── Top bar ── */}
      <header className="topbar">
        <div className="topbar-logo-mark">
          <Bike size={18} />
        </div>
        <div className="flex-1">
          <div className="topbar-title">Bhada Rider</div>
          <div className="topbar-sub">{user?.phoneNumber || ''}</div>
        </div>

        {/* Bell icon with unseen badge */}
        <button
          onClick={openDrawer}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            position: 'relative', padding: '6px 8px', color: 'var(--text-1)',
            display: 'flex', alignItems: 'center',
          }}
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unseenCount > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 2,
              minWidth: 16, height: 16, borderRadius: 99,
              background: 'var(--accent)', color: 'var(--bg-0)',
              fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-mono)',
              display: 'grid', placeItems: 'center', padding: '0 3px',
              border: '2px solid var(--bg-1)',
            }}>
              {unseenCount > 9 ? '9+' : unseenCount}
            </span>
          )}
        </button>
      </header>

      {/* ── Page content ── */}
      <main className="page-content">
        <Outlet />
      </main>

      {/* ── Bottom navigation ── */}
      <nav className="bottom-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Notification bottom drawer ── */}
      <NotificationDrawer />
    </div>
  );
}
