import React, { useState, useEffect } from 'react';
import { Package, RefreshCw, X, CheckCircle, Truck, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusBadge = (status) => {
  const map = {
    PLACED: 'blue', DISPATCHED: 'orange', DELIVERED: 'green',
    CANCELLED: 'red', DRAFT: 'neutral',
  };
  return <span className={`badge ${map[status] || 'neutral'}`}>{status}</span>;
};

function OtpInput({ label, onSubmit, loading }) {
  const [otp, setOtp] = useState('');
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
      <input
        className="form-input"
        placeholder={`Enter ${label} OTP`}
        value={otp}
        onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
        style={{ flex: 1, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', fontSize: 16 }}
        maxLength={6}
      />
      <button className="btn btn-primary btn-sm" onClick={() => { onSubmit(otp); setOtp(''); }} disabled={loading || otp.length < 4}>
        <CheckCircle size={13} />
        Confirm
      </button>
    </div>
  );
}

function OrderCard({ order, onAction, loading }) {
  const [cancelReason, setCancelReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [showHandover, setShowHandover] = useState(false);
  const [showDeliver, setShowDeliver] = useState(false);

  const status = order.status;
  const id = order.orderId || order.id;

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="flex items-center justify-between mb-8">
        <span className="code">#{(id || '').slice(-10)}</span>
        {statusBadge(status)}
      </div>

      {order.items?.length > 0 && (
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}: {order.items.map(i => i.description || i.name || 'Item').join(', ')}
        </div>
      )}

      <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12 }}>
        Created: {order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}
      </div>

      {/* Actions */}
      {status === 'PLACED' && (
        <div className="flex gap-8">
          <button className="btn btn-primary btn-sm flex-1" disabled={loading} onClick={() => onAction('accept', id)}>
            <Truck size={13} /> Accept Order
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => setShowCancel(true)}>
            <X size={13} />
          </button>
        </div>
      )}

      {status === 'DISPATCHED' && (
        <div className="flex flex-col gap-8">
          {!showHandover && !showDeliver && (
            <div className="flex gap-8">
              <button className="btn btn-primary btn-sm flex-1" onClick={() => setShowHandover(true)}>
                <KeyRound size={13} /> Pickup Handover
              </button>
              <button className="btn btn-secondary btn-sm flex-1" onClick={() => setShowDeliver(true)}>
                <CheckCircle size={13} /> Deliver
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => setShowCancel(true)}>
                <X size={13} />
              </button>
            </div>
          )}
          {showHandover && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>Enter pickup OTP from sender:</div>
              <OtpInput label="Pickup" loading={loading}
                onSubmit={otp => { onAction('handover', id, otp); setShowHandover(false); }} />
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }} onClick={() => setShowHandover(false)}>Cancel</button>
            </div>
          )}
          {showDeliver && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>Enter drop OTP from recipient:</div>
              <OtpInput label="Drop" loading={loading}
                onSubmit={otp => { onAction('deliver', id, otp); setShowDeliver(false); }} />
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }} onClick={() => setShowDeliver(false)}>Cancel</button>
            </div>
          )}
        </div>
      )}

      {showCancel && (
        <div style={{ marginTop: 10, background: 'var(--bg-2)', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>Reason for cancellation:</div>
          <textarea className="form-textarea" placeholder="Optional reason..." value={cancelReason}
            onChange={e => setCancelReason(e.target.value)} style={{ minHeight: 60 }} />
          <div className="flex gap-8" style={{ marginTop: 8 }}>
            <button className="btn btn-ghost btn-sm flex-1" onClick={() => setShowCancel(false)}>Back</button>
            <button className="btn btn-danger btn-sm flex-1" disabled={loading}
              onClick={() => { onAction('cancel', id, cancelReason); setShowCancel(false); }}>
              Cancel Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [tab, setTab] = useState('available');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getAvailable();
      setOrders(res.data?.data || []);
    } catch {
      toast.error('Failed to load orders');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleAction = async (action, orderId, extra) => {
    setActionLoading(true);
    try {
      if (action === 'accept') {
        await ordersAPI.accept(orderId);
        toast.success('Order accepted!');
      } else if (action === 'cancel') {
        await ordersAPI.cancelDelivery(orderId, extra);
        toast.success('Delivery cancelled');
      } else if (action === 'handover') {
        await ordersAPI.handover(orderId, extra);
        toast.success('Pickup confirmed! Parcel collected.');
      } else if (action === 'deliver') {
        await ordersAPI.deliver(orderId, extra);
        toast.success('Order delivered! Great work!');
      }
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally { setActionLoading(false); }
  };

  const tabs = ['available', 'dispatched'];

  const filtered = orders.filter(o => {
    if (tab === 'available') return o.status === 'PLACED';
    if (tab === 'dispatched') return o.status === 'DISPATCHED';
    return true;
  });

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
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              background: tab === t ? 'var(--bg-1)' : 'transparent',
              color: tab === t ? 'var(--accent)' : 'var(--text-2)',
              transition: 'all 0.15s ease',
            }}>
            {t === 'available' ? 'Available' : 'In Progress'}
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
        filtered.map(order => (
          <OrderCard key={order.orderId || order.id} order={order} onAction={handleAction} loading={actionLoading} />
        ))
      )}
    </div>
  );
}
