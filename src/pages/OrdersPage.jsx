import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, RefreshCw, ChevronRight, MapPin, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersAPI } from '../services/api';
import { getSocket } from '../services/socketService';

const statusBadge = (status) => {
  const map = {
    PLACED: 'blue', READY: 'green', DISPATCHED: 'orange', DELIVERED: 'green',
    CANCELLED: 'red', DRAFT: 'neutral',
  };
  return <span className={`badge ${map[status] || 'neutral'}`}>{status}</span>;
};

const TABS = [
  { key: 'available',  label: 'Available',   statuses: ['PLACED'] },
  { key: 'dispatched', label: 'In Progress',  statuses: ['DISPATCHED', 'READY'] },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders,        setMyOrders]        = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('available');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch both in parallel:
      // - /orders/available  → all PLACED orders visible to this rider
      // - /orders/my-rider-orders → orders assigned to this rider (READY, DISPATCHED, etc.)
      const [availRes, myRes] = await Promise.allSettled([
        ordersAPI.getAvailable(),
        ordersAPI.getMyOrders(),
      ]);
      setAvailableOrders(availRes.status === 'fulfilled' ? (availRes.value.data?.data || []) : []);
      setMyOrders(myRes.status === 'fulfilled' ? (myRes.value.data?.data || []) : []);
    } catch {
      toast.error('Failed to load orders');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Listen for real-time new order notifications via socket.
  // The backend only emits 'notification:new' with type ORDER_AVAILABLE to
  // riders who are in the eligibleRiderIds list — so this event fires ONLY
  // for eligible riders. We auto-refresh the available orders list when it fires.
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleNewNotification = (n) => {
      if (n?.type === 'ORDER_AVAILABLE') {
        fetchOrders(); // backend already filtered — safe to refresh
        toast('📦 New order available!', { duration: 3000 });
      }
    };
    socket.on('notification:new', handleNewNotification);
    return () => socket.off('notification:new', handleNewNotification);
  }, []);

  const currentTab = TABS.find(t => t.key === tab);
  // Available tab: PLACED orders from the broadcast list
  // In Progress tab: rider's own READY + DISPATCHED orders from their assigned list
  const filtered = tab === 'available'
    ? availableOrders.filter(o => currentTab.statuses.includes(o.status))
    : myOrders.filter(o => currentTab.statuses.includes(o.status));

  return (
    <div>
      <div className="flex items-center justify-between mb-16">
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Orders</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Accept and manage deliveries</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchOrders} style={{ padding: 8 }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, background: 'var(--bg-2)', padding: 4, borderRadius: 10 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
            background: tab === t.key ? 'var(--bg-1)' : 'transparent',
            color: tab === t.key ? 'var(--accent)' : 'var(--text-2)',
            transition: 'all 0.15s ease',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-center"><div className="loader" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Package size={22} /></div>
          <h3>{tab === 'available' ? 'No available orders' : 'No active deliveries'}</h3>
          <p>{tab === 'available' ? 'Go online to receive orders' : 'Accept an order to see it here'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(order => {
            const id = order.orderId || order.id;
            const pickupArea = [order.senderNode?.area, order.senderNode?.city].filter(Boolean).join(', ');
            const dropArea   = [order.receiverNode?.area, order.receiverNode?.city].filter(Boolean).join(', ');
            const itemCount  = order.items?.length || 0;
            const hasImages  = order.items?.some(i => i.images?.length > 0);
            const amount     = order.billing?.payableAmount;
            const distKm     = order.billing?.totalDistance;

            return (
              <div key={id} className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                onClick={() => navigate(`/orders/${id}`)}>

                {/* Icon */}
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Package size={18} style={{ color: 'var(--accent)' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <span className="code" style={{ fontSize: 12 }}>#{id.slice(-8).toUpperCase()}</span>
                    {statusBadge(order.status)}
                  </div>

                  {/* Route */}
                  <div style={{ marginBottom: 5 }}>
                    {pickupArea && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e5a0', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pickupArea}</span>
                      </div>
                    )}
                    {dropArea && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff4d6d', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dropArea}</span>
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    {itemCount > 0 && <span style={{ fontSize: 11, color: 'var(--text-2)' }}>📦 {itemCount} item{itemCount !== 1 ? 's' : ''}</span>}
                    {hasImages && <span style={{ fontSize: 11, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 3 }}><Camera size={10} /> Photos</span>}
                    {amount && <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>₹{Number(amount).toFixed(0)}</span>}
                    {distKm && <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{Number(distKm).toFixed(1)} km</span>}
                  </div>
                </div>

                <ChevronRight size={16} style={{ color: 'var(--text-2)', flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}