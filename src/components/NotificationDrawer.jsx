import React from 'react';
import { X, Bell, CheckCheck, RefreshCw, Package, Bike, AlertTriangle, CreditCard, FileText } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const TYPE_META = {
  ONBOARDING_SUBMITTED: { Icon: FileText,      color: '#4B9EFF', bg: 'rgba(75,158,255,0.12)',  tag: 'Onboarding' },
  ONBOARDING_APPROVED:  { Icon: Bell,          color: '#2ECC71', bg: 'rgba(46,204,113,0.12)',  tag: 'Onboarding' },
  ONBOARDING_REJECTED:  { Icon: Bell,          color: '#FF4757', bg: 'rgba(255,71,87,0.12)',   tag: 'Onboarding' },
  KYC_SUBMITTED:        { Icon: FileText,      color: '#4B9EFF', bg: 'rgba(75,158,255,0.12)',  tag: 'KYC' },
  KYC_APPROVED:         { Icon: FileText,      color: '#2ECC71', bg: 'rgba(46,204,113,0.12)',  tag: 'KYC' },
  KYC_REJECTED:         { Icon: FileText,      color: '#FF4757', bg: 'rgba(255,71,87,0.12)',   tag: 'KYC' },
  ORDER_PLACED:         { Icon: Package,       color: '#1EC674', bg: 'rgba(30,198,116,0.12)',  tag: 'Order' },
  ORDER_ACCEPTED:       { Icon: Bike,          color: '#1EC674', bg: 'rgba(30,198,116,0.12)',  tag: 'Order' },
  ORDER_DISPATCHED:     { Icon: Bike,          color: '#FF8C42', bg: 'rgba(255,140,66,0.12)',  tag: 'Order' },
  ORDER_DELIVERED:      { Icon: Package,       color: '#2ECC71', bg: 'rgba(46,204,113,0.12)',  tag: 'Order' },
  ORDER_CANCELLED:      { Icon: Package,       color: '#FF4757', bg: 'rgba(255,71,87,0.12)',   tag: 'Order' },
  ORDER_AVAILABLE:      { Icon: Package,       color: '#1EC674', bg: 'rgba(30,198,116,0.12)',  tag: 'New Order' },
  DISPUTE_RAISED:       { Icon: AlertTriangle, color: '#FF8C42', bg: 'rgba(255,140,66,0.12)',  tag: 'Dispute' },
  DISPUTE_RESOLVED:     { Icon: AlertTriangle, color: '#2ECC71', bg: 'rgba(46,204,113,0.12)',  tag: 'Dispute' },
  PAYMENT_SUCCESS:      { Icon: CreditCard,    color: '#2ECC71', bg: 'rgba(46,204,113,0.12)',  tag: 'Payment' },
  PAYMENT_REFUNDED:     { Icon: CreditCard,    color: '#4B9EFF', bg: 'rgba(75,158,255,0.12)',  tag: 'Payment' },
};
const DEFAULT_META = { Icon: Bell, color: 'var(--text-2)', bg: 'var(--bg-3)', tag: 'System' };

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationDrawer() {
  const { notifications, unseenCount, loading, drawerOpen,
          closeDrawer, markSeen, markAllSeen, fetchNotifications } = useNotifications();

  if (!drawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(5,7,12,0.8)',
          zIndex: 200,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.18s ease',
        }}
      />

      {/* Bottom sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480,
        height: '78vh',
        background: 'var(--bg-1)',
        borderRadius: '22px 22px 0 0',
        zIndex: 201,
        display: 'flex', flexDirection: 'column',
        animation: 'sheetUp 0.25s cubic-bezier(0.32, 0, 0.15, 1)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
        border: '1px solid var(--border-bright)',
        borderBottom: 'none',
      }}>
        {/* Drag handle */}
        <div style={{
          width: 40, height: 4, borderRadius: 99,
          background: 'var(--bg-4)',
          margin: '12px auto 0',
          flexShrink: 0,
        }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px 12px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              fontSize: 17, fontWeight: 800, color: 'var(--text-0)',
              letterSpacing: '-0.03em',
            }}>
              Notifications
            </div>
            {unseenCount > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-mono)',
                background: 'var(--red)', color: '#fff',
                padding: '1px 7px', borderRadius: 99,
              }}>
                {unseenCount}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {unseenCount > 0 && (
              <button
                onClick={markAllSeen}
                style={{
                  background: 'var(--bg-2)', border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)', padding: '6px 10px',
                  cursor: 'pointer', color: 'var(--accent)',
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
            <button
              onClick={fetchNotifications}
              style={{
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)', width: 32, height: 32,
                display: 'grid', placeItems: 'center',
                cursor: 'pointer', color: 'var(--text-1)',
              }}
            >
              <RefreshCw size={13} />
            </button>
            <button
              onClick={closeDrawer}
              style={{
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)', width: 32, height: 32,
                display: 'grid', placeItems: 'center',
                cursor: 'pointer', color: 'var(--text-1)',
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
          {loading && notifications.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <div className="loader" />
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-2)' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 'var(--r-lg)',
                background: 'var(--bg-2)', margin: '0 auto 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bell size={22} style={{ opacity: 0.3 }} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 5 }}>
                All caught up!
              </div>
              <div style={{ fontSize: 12 }}>No new notifications</div>
            </div>
          ) : (
            notifications.map(n => {
              const m = TYPE_META[n.type] || DEFAULT_META;
              const { Icon } = m;
              return (
                <div
                  key={n.id}
                  onClick={() => !n.seen && markSeen(n.id)}
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', gap: 12,
                    cursor: n.seen ? 'default' : 'pointer',
                    background: n.seen ? 'transparent' : 'rgba(30,198,116,0.03)',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 'var(--r-md)',
                    background: m.bg, color: m.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={16} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                      <span style={{ fontWeight: n.seen ? 500 : 700, fontSize: 13, color: 'var(--text-0)', lineHeight: 1.35 }}>
                        {n.title}
                      </span>
                      {!n.seen && (
                        <div style={{
                          width: 7, height: 7, borderRadius: '50%',
                          background: 'var(--accent)', flexShrink: 0, marginTop: 4,
                        }} />
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 3, lineHeight: 1.45 }}>
                      {n.body}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 7 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: m.color, background: m.bg,
                        padding: '2px 8px', borderRadius: 99,
                        letterSpacing: '0.03em',
                      }}>
                        {m.tag}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
