import React from 'react';
import { Package, ChevronRight, Camera, Navigation, Clock, MapPin } from 'lucide-react';

const STATUS_CONFIG = {
  PLACED:     { label: 'New Order',   color: '#4B9EFF', bg: 'rgba(75,158,255,0.13)',  dot: '#4B9EFF' },
  READY:      { label: 'Ready',       color: '#1EC674', bg: 'rgba(30,198,116,0.13)',  dot: '#1EC674' },
  DISPATCHED: { label: 'On the way',  color: '#FF8C42', bg: 'rgba(255,140,66,0.13)',  dot: '#FF8C42' },
  DELIVERED:  { label: 'Delivered',   color: '#2ECC71', bg: 'rgba(46,204,113,0.13)',  dot: '#2ECC71' },
  CANCELLED:  { label: 'Cancelled',   color: '#FF4757', bg: 'rgba(255,71,87,0.13)',   dot: '#FF4757' },
  DRAFT:      { label: 'Draft',       color: '#4E5870', bg: 'rgba(78,88,112,0.13)',   dot: '#4E5870' },
};

const ICON_BG = {
  PLACED:     'rgba(75,158,255,0.1)',
  READY:      'rgba(30,198,116,0.1)',
  DISPATCHED: 'rgba(255,140,66,0.1)',
  DELIVERED:  'rgba(46,204,113,0.1)',
  CANCELLED:  'rgba(255,71,87,0.08)',
  DRAFT:      'var(--bg-3)',
};

function timeAgo(date) {
  if (!date) return null;
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function OrderCard({ order, onClick }) {
  const id         = order.orderId || order.id || '';
  const status     = order.status;
  const cfg        = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
  const pickupArea = [order.senderNode?.area, order.senderNode?.city].filter(Boolean).join(', ');
  const dropArea   = [order.receiverNode?.area, order.receiverNode?.city].filter(Boolean).join(', ');
  const itemCount  = order.items?.length || 0;
  const hasImages  = order.items?.some(i => i.images?.length > 0);
  const amount     = order.billing?.payableAmount;
  const distKm     = order.billing?.totalDistance;
  const isActive   = ['PLACED', 'READY', 'DISPATCHED'].includes(status);

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all var(--transition)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-bright)';
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      {/* Left accent stripe for active orders */}
      {isActive && (
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
          background: cfg.dot,
          borderRadius: 'var(--r-lg) 0 0 var(--r-lg)',
        }} />
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingLeft: isActive ? 8 : 0 }}>

        {/* Icon box */}
        <div style={{
          width: 46, height: 46,
          borderRadius: 'var(--r-md)',
          background: ICON_BG[status] || 'var(--bg-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Package size={20} style={{ color: cfg.dot }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Row 1: ID + Status badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{
              fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
              color: 'var(--text-2)', letterSpacing: '0.05em',
            }}>
              #{id.slice(-8).toUpperCase()}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: '0.04em',
              padding: '3px 10px', borderRadius: 99,
              color: cfg.color, background: cfg.bg,
            }}>
              {cfg.label.toUpperCase()}
            </span>
          </div>

          {/* Row 2: Route */}
          {(pickupArea || dropArea) && (
            <div style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-sm)',
              padding: '9px 11px',
              marginBottom: 10,
              display: 'flex', flexDirection: 'column', gap: 7,
            }}>
              {pickupArea && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#1EC674', flexShrink: 0,
                    boxShadow: '0 0 5px rgba(30,198,116,0.6)',
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {pickupArea}
                  </span>
                </div>
              )}
              {pickupArea && dropArea && (
                <div style={{ height: 1, background: 'var(--border)', marginLeft: 15 }} />
              )}
              {dropArea && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#FF4757', flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {dropArea}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Row 3: Meta chips */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            {itemCount > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 600, color: 'var(--text-2)',
                background: 'var(--bg-3)', padding: '2px 8px', borderRadius: 99,
              }}>
                📦 {itemCount}
              </span>
            )}
            {hasImages && (
              <span style={{
                fontSize: 11, fontWeight: 600, color: 'var(--text-2)',
                background: 'var(--bg-3)', padding: '2px 8px', borderRadius: 99,
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                <Camera size={9} /> Photo
              </span>
            )}
            {amount && (
              <span style={{
                fontSize: 13, fontWeight: 800, color: 'var(--accent)',
                fontFamily: 'var(--font-mono)',
              }}>
                ₹{Number(amount).toFixed(0)}
              </span>
            )}
            {distKm && (
              <span style={{
                fontSize: 11, fontWeight: 600, color: 'var(--text-2)',
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                <Navigation size={9} /> {Number(distKm).toFixed(1)} km
              </span>
            )}
            {order.createdAt && (
              <span style={{
                fontSize: 11, color: 'var(--text-2)', marginLeft: 'auto',
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                <Clock size={9} /> {timeAgo(order.createdAt)}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <ChevronRight size={16} style={{ color: 'var(--text-2)', flexShrink: 0, marginTop: 14 }} />
      </div>
    </div>
  );
}
