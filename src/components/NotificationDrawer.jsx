import React from 'react';
import { X, Bell, CheckCheck, RefreshCw, Package, Bike, AlertTriangle, CreditCard, FileText } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const TYPE_META = {
  ONBOARDING_SUBMITTED: { Icon: FileText,      color: 'var(--blue)',    bg: 'var(--blue-dim)',    tag: 'Onboarding' },
  ONBOARDING_APPROVED:  { Icon: Bell,          color: 'var(--green)',   bg: 'var(--green-dim)',   tag: 'Onboarding' },
  ONBOARDING_REJECTED:  { Icon: Bell,          color: 'var(--red)',     bg: 'var(--red-dim)',     tag: 'Onboarding' },
  KYC_SUBMITTED:        { Icon: FileText,      color: 'var(--blue)',    bg: 'var(--blue-dim)',    tag: 'KYC' },
  KYC_APPROVED:         { Icon: FileText,      color: 'var(--green)',   bg: 'var(--green-dim)',   tag: 'KYC' },
  KYC_REJECTED:         { Icon: FileText,      color: 'var(--red)',     bg: 'var(--red-dim)',     tag: 'KYC' },
  ORDER_PLACED:         { Icon: Package,       color: 'var(--accent)',  bg: 'var(--accent-dim)',  tag: 'Order' },
  ORDER_ACCEPTED:       { Icon: Bike,          color: 'var(--accent)',  bg: 'var(--accent-dim)',  tag: 'Order' },
  ORDER_DISPATCHED:     { Icon: Bike,          color: 'var(--accent)',  bg: 'var(--accent-dim)',  tag: 'Order' },
  ORDER_DELIVERED:      { Icon: Package,       color: 'var(--green)',   bg: 'var(--green-dim)',   tag: 'Order' },
  ORDER_CANCELLED:      { Icon: Package,       color: 'var(--red)',     bg: 'var(--red-dim)',     tag: 'Order' },
  ORDER_AVAILABLE:      { Icon: Package,       color: 'var(--accent)',  bg: 'var(--accent-dim)',  tag: 'New Order' },
  DISPUTE_RAISED:       { Icon: AlertTriangle, color: 'var(--orange)',  bg: 'var(--orange-dim)',  tag: 'Dispute' },
  DISPUTE_RESOLVED:     { Icon: AlertTriangle, color: 'var(--green)',   bg: 'var(--green-dim)',   tag: 'Dispute' },
  PAYMENT_SUCCESS:      { Icon: CreditCard,    color: 'var(--green)',   bg: 'var(--green-dim)',   tag: 'Payment' },
  PAYMENT_REFUNDED:     { Icon: CreditCard,    color: 'var(--blue)',    bg: 'var(--blue-dim)',    tag: 'Payment' },
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
        style={{ position:'fixed', inset:0, zIndex:299, background:'rgba(5,8,15,0.65)' }}
      />

      {/* Bottom drawer — mobile-first */}
      <div style={{
        position:'fixed', left:0, right:0, bottom:0,
        maxHeight:'80vh', background:'var(--bg-1)',
        borderTop:'1px solid var(--border-bright)',
        borderRadius:'20px 20px 0 0',
        zIndex:300, display:'flex', flexDirection:'column',
        boxShadow:'0 -12px 48px rgba(0,0,0,0.5)',
        animation:'slideUp 0.22s ease',
        maxWidth:480, margin:'0 auto',
      }}>

        {/* Drag handle */}
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 6px' }}>
          <div style={{ width:36, height:4, borderRadius:99, background:'var(--border-bright)' }} />
        </div>

        {/* Header */}
        <div style={{
          padding:'0 20px 14px', display:'flex',
          alignItems:'center', justifyContent:'space-between',
          borderBottom:'1px solid var(--border)', flexShrink:0,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Bell size={16} style={{ color:'var(--accent)' }} />
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15 }}>
              Notifications
            </span>
            {unseenCount > 0 && (
              <span style={{
                background:'var(--accent)', color:'var(--bg-0)',
                borderRadius:99, fontSize:10, fontWeight:700,
                padding:'1px 7px', fontFamily:'var(--font-mono)',
              }}>
                {unseenCount}
              </span>
            )}
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {unseenCount > 0 && (
              <button
                onClick={markAllSeen}
                className="btn btn-ghost btn-sm"
                style={{ gap:4, fontSize:11 }}
              >
                <CheckCheck size={12} /> All read
              </button>
            )}
            <button
              onClick={fetchNotifications}
              className="btn btn-ghost btn-sm"
              style={{ padding:'5px 6px' }}
            >
              <RefreshCw size={12} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} />
            </button>
            <button onClick={closeDrawer} className="btn btn-ghost btn-sm" style={{ padding:'5px 6px' }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex:1, overflowY:'auto', paddingBottom:16 }}>
          {loading && notifications.length === 0 ? (
            <div style={{ padding:40, textAlign:'center' }}>
              <div className="loader" />
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding:40, textAlign:'center', color:'var(--text-2)' }}>
              <Bell size={32} style={{ marginBottom:10, opacity:0.25 }} />
              <div style={{ fontSize:13 }}>No notifications yet</div>
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
                    padding:'13px 20px', borderBottom:'1px solid var(--border)',
                    display:'flex', gap:12, cursor: n.seen ? 'default' : 'pointer',
                    background: n.seen ? 'transparent' : 'rgba(0,229,160,0.025)',
                  }}
                >
                  <div style={{
                    width:34, height:34, borderRadius:9, flexShrink:0,
                    background:m.bg, color:m.color, display:'grid', placeItems:'center',
                  }}>
                    <Icon size={15} />
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', gap:6, alignItems:'flex-start' }}>
                      <span style={{ fontWeight: n.seen ? 500 : 700, fontSize:13, color:'var(--text-0)', lineHeight:1.3 }}>
                        {n.title}
                      </span>
                      {!n.seen && (
                        <div style={{
                          width:6, height:6, borderRadius:'50%',
                          background:'var(--accent)', flexShrink:0, marginTop:3,
                        }} />
                      )}
                    </div>
                    <div style={{ fontSize:12, color:'var(--text-2)', marginTop:2, lineHeight:1.4 }}>
                      {n.body}
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
                      <span style={{
                        fontSize:10, color:m.color, background:m.bg,
                        padding:'2px 6px', borderRadius:4, fontFamily:'var(--font-mono)',
                      }}>
                        {m.tag}
                      </span>
                      <span style={{ fontSize:10, color:'var(--text-2)', fontFamily:'var(--font-mono)' }}>
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

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity:0; }
          to   { transform: translateY(0);    opacity:1; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
