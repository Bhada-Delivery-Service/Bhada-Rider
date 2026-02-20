import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, MapPin, User, Bike } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home', exact: true },
  { to: '/orders', icon: Package, label: 'Orders' },
  { to: '/routes', icon: MapPin, label: 'Routes' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-logo-mark">
          <Bike size={18} />
        </div>
        <div className="flex-1">
          <div className="topbar-title">Bhada Rider</div>
          <div className="topbar-sub">{user?.phoneNumber || ''}</div>
        </div>
      </header>

      {/* Page content */}
      <main className="page-content">
        <Outlet />
      </main>

      {/* Bottom navigation */}
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
    </div>
  );
}
