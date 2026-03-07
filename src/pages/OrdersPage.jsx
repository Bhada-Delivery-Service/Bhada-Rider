import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, RefreshCw, ChevronRight } from 'lucide-react';
import { useOrders }         from '../hooks/useOrders';
import OrderCard             from '../components/order/OrderCard';
import { SkeletonOrderCard } from '../components/ui/SkeletonLoader';

const TABS = [
  { key: 'available',  label: 'Available',  icon: '🆕', statuses: ['PLACED'] },
  { key: 'dispatched', label: 'Active',      icon: '🚴', statuses: ['DISPATCHED', 'READY'] },
];

const TabBar = memo(function TabBar({ tab, onSelect, counts }) {
  return (
    <div style={{
      display: 'flex', gap: 6, marginBottom: 16,
      background: 'var(--bg-2)',
      border: '1px solid var(--border)',
      padding: 4, borderRadius: 'var(--r-md)',
    }}>
      {TABS.map(t => (
        <button
          key={t.key}
          onClick={() => onSelect(t.key)}
          style={{
            flex: 1, padding: '9px 0', borderRadius: 'var(--r-sm)',
            border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 700,
            letterSpacing: '-0.01em',
            background: tab === t.key ? 'var(--bg-1)' : 'transparent',
            color: tab === t.key ? 'var(--text-0)' : 'var(--text-2)',
            transition: 'all 0.16s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: tab === t.key ? 'var(--shadow-card)' : 'none',
          }}
        >
          {tab === t.key && <span>{t.icon}</span>}
          {t.label}
          {counts[t.key] > 0 && (
            <span style={{
              background: tab === t.key ? 'var(--accent)' : 'var(--bg-3)',
              color: tab === t.key ? '#fff' : 'var(--text-2)',
              fontSize: 10, fontWeight: 800,
              padding: '1px 6px', borderRadius: 99,
              fontFamily: 'var(--font-mono)',
            }}>
              {counts[t.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
});

export default function OrdersPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('available');

  const { availableOrders, myOrders, loading, refreshing, refetch } = useOrders();

  const tabOrders = {
    available:  availableOrders.filter(o => o.status === 'PLACED'),
    dispatched: myOrders.filter(o => ['DISPATCHED', 'READY'].includes(o.status)),
  };

  const filtered  = tabOrders[tab] || [];

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-16">
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-0)', letterSpacing: '-0.04em' }}>
            Orders
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, marginTop: 2 }}>
            Accept and manage deliveries
          </div>
        </div>
        <button
          onClick={refetch}
          disabled={refreshing}
          style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)', width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-1)',
          }}
        >
          <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
        </button>
      </div>

      <TabBar tab={tab} onSelect={setTab} counts={{ available: tabOrders.available.length, dispatched: tabOrders.dispatched.length }} />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[0, 1, 2].map(i => <SkeletonOrderCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Package size={22} style={{ color: 'var(--text-2)' }} />
          </div>
          <h3>{tab === 'available' ? 'No orders available' : 'No active deliveries'}</h3>
          <p>{tab === 'available' ? 'Go online to receive new orders' : 'Accept an order to see it here'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(order => {
            const id = order.orderId || order.id;
            return <OrderCard key={id} order={order} onClick={() => navigate(`/orders/${id}`)} />;
          })}
        </div>
      )}
    </div>
  );
}
