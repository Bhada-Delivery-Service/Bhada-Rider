/**
 * NewOrderAlert.jsx — Full-screen overlay shown when a new order arrives.
 *
 * - Plays the ring tone automatically (via soundService)
 * - Pulses with an animated green ring
 * - Shows order details: pickup → drop city, item count, amount, distance
 * - "View Order" button → navigates to order detail
 * - "Dismiss" button → silently closes the alert
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, ChevronRight, X, IndianRupee, Ruler } from 'lucide-react';
import { startRing, stopRing } from '../../services/soundService';
import { useAuth } from '../../context/AuthContext';

export default function NewOrderAlert({ order, onDismiss }) {
  const navigate = useNavigate();
  const { rider } = useAuth();
  const isBlocked = rider?.status === 'BLOCKED' || rider?.riderAvailabilityStatus === 'BLOCKED';
  const [visible, setVisible] = useState(false);

  // Mount animation
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Start ring when alert appears; stop when it unmounts
  // Blocked riders: don't ring — they can't accept anyway
  useEffect(() => {
    if (!isBlocked) startRing();
    return () => stopRing();
  }, [isBlocked]);

  const close = () => {
    stopRing();
    setVisible(false);
    setTimeout(onDismiss, 220); // wait for fade-out
  };

  const handleView = () => {
    const id = order?.orderId || order?.id;
    close();
    if (id) setTimeout(() => navigate(`/orders/${id}`), 230);
    else    setTimeout(() => navigate('/orders'), 230);
  };

  // Derive display info from full order object
  const pickupCity = [order?.senderNode?.area, order?.senderNode?.city].filter(Boolean).join(', ') || '—';
  const dropCity   = [order?.receiverNode?.area, order?.receiverNode?.city].filter(Boolean).join(', ') || '—';

  const itemCount  = order?.items?.length ?? 0;
  const amount     = order?.billing?.payableAmount
    ? `₹${Number(order.billing.payableAmount).toFixed(0)}`
    : null;
  const distance   = order?.billing?.totalDistance
    ? `${Number(order.billing.totalDistance).toFixed(1)} km`
    : null;

  return (
    <>
      {/* ── Keyframe styles injected once ── */}
      <style>{`
        @keyframes nar-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.55); opacity: 0;   }
          100% { transform: scale(1.55); opacity: 0;   }
        }
        @keyframes nar-pulse2 {
          0%   { transform: scale(1);   opacity: 0.45; }
          70%  { transform: scale(1.8);  opacity: 0;   }
          100% { transform: scale(1.8);  opacity: 0;   }
        }
        @keyframes nar-bounce {
          0%, 100% { transform: translateY(0);   }
          50%       { transform: translateY(-8px); }
        }
        @keyframes nar-fadein {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      {/* ── Backdrop ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(5,8,15,0.98)',
        backdropFilter: 'blur(8px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 24px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.22s ease',
      }}>

        {/* Dismiss X — top right */}
        <button
          onClick={close}
          style={{
            position: 'absolute', top: 20, right: 20,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%', width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
          }}
        >
          <X size={18} />
        </button>

        {/* ── Pulsing ring icon ── */}
        <div style={{ position: 'relative', marginBottom: 32 }}>
          {/* Outer pulse rings */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            background: 'rgba(0,229,160,0.25)',
            animation: 'nar-pulse2 1.4s ease-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            background: 'rgba(0,229,160,0.35)',
            animation: 'nar-pulse 1.4s ease-out infinite 0.2s',
          }} />
          {/* Icon circle */}
          <div style={{
            position: 'relative',
            width: 90, height: 90,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(0,229,160,0.2), rgba(0,229,160,0.08))',
            border: '2px solid rgba(0,229,160,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'nar-bounce 1s ease-in-out infinite',
          }}>
            <Package size={38} style={{ color: '#00e5a0' }} />
          </div>
        </div>

        {/* ── Card ── */}
        <div style={{
          width: '100%', maxWidth: 360,
          background: '#0d1117',
          border: '1.5px solid rgba(0,229,160,0.3)',
          borderRadius: 20,
          padding: '22px 20px',
          animation: 'nar-fadein 0.3s ease',
          boxShadow: '0 0 40px rgba(0,229,160,0.12), 0 20px 60px rgba(0,0,0,0.6)',
        }}>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(0,229,160,0.12)',
              border: '1px solid rgba(0,229,160,0.3)',
              borderRadius: 99,
              padding: '3px 12px',
              fontSize: 10, fontWeight: 800,
              color: '#00e5a0',
              letterSpacing: '0.1em',
              marginBottom: 8,
              fontFamily: 'var(--font-mono, monospace)',
            }}>
              NEW ORDER
            </div>
            <div style={{
              fontSize: 22, fontWeight: 800,
              color: '#f0f4ff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}>
              Order Available!
            </div>
          </div>

          {/* Route */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12,
            padding: '12px 14px',
            marginBottom: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e5a0', flexShrink: 0 }} />
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.06em' }}>PICKUP</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f4ff', marginLeft: 'auto', textAlign: 'right', maxWidth: '65%' }}>{pickupCity}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4d6d', flexShrink: 0 }} />
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.06em' }}>DROP</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f4ff', marginLeft: 'auto', textAlign: 'right', maxWidth: '65%' }}>{dropCity}</div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 4 }}>ITEMS</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#f0f4ff' }}>{itemCount}</div>
            </div>
            {amount && (
              <div style={{ flex: 1, background: 'rgba(0,229,160,0.07)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'rgba(0,229,160,0.7)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 4 }}>AMOUNT</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#00e5a0' }}>{amount}</div>
              </div>
            )}
            {distance && (
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 4 }}>DIST</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#f0f4ff' }}>{distance}</div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {isBlocked ? (
            /* ── Blocked rider — cannot accept, show clear reason ── */
            <div style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(220,38,38,0.12)',
              border: '1.5px solid rgba(220,38,38,0.45)',
              marginBottom: 10,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>🚫</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#ff4d6d', marginBottom: 4 }}>
                Order Accept Nahi Ho Sakta
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55 }}>
                Aapka account <strong style={{ color: '#ff4d6d' }}>block</strong> hai.{''}
                Admin se contact karein apna account unblock karwane ke liye.
              </div>
            </div>
          ) : (
            <button
              onClick={handleView}
              style={{
                width: '100%',
                padding: '14px 0',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #00e5a0, #00c87a)',
                color: '#05080f',
                fontSize: 15, fontWeight: 800,
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginBottom: 10,
                boxShadow: '0 4px 20px rgba(0,229,160,0.35)',
                transition: 'transform 0.1s ease, box-shadow 0.1s ease',
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              View Order <ChevronRight size={17} />
            </button>
          )}

          <button
            onClick={close}
            style={{
              width: '100%',
              padding: '12px 0',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </>
  );
}