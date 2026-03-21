import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Package, MapPin, Navigation, CheckCircle,
  Truck, KeyRound, X, Images, ChevronLeft, ChevronRight,
  Phone, Hash, RefreshCw, QrCode, Banknote, Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersAPI, codPaymentsAPI } from '../services/api';
// import { useNotifications } from '../context/NotificationContext';
import { useNotifications } from '../context/NotificationContext';
import { useActionGuard } from '../hooks/useActionGuard';
import { logger } from '../utils/logger';
import StatusStepper from '../components/ui/StatusStepper';
import OTPModal from '../components/order/OTPModal';
import { SkeletonCard } from '../components/ui/SkeletonLoader';

const log = logger('OrderDetail');

/* ─── Pickup Countdown Timer ─────────────────────────────────────────────── */
const PICKUP_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours

const PULSE_STYLE_ID = 'timer-pulse-style';
if (!document.getElementById(PULSE_STYLE_ID)) {
  const s = document.createElement('style');
  s.id = PULSE_STYLE_ID;
  s.textContent = `@keyframes timerPulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,71,87,0.6)} 50%{box-shadow:0 0 0 6px rgba(255,71,87,0)} }`;
  document.head.appendChild(s);
}

function PickupCountdownTimer({ order }) {
  const [timeLeft, setTimeLeft] = useState(null);

  const startTime = order.readyAt || order.statusUpdatedAt || (order.status === 'READY' ? order.updatedAt : null);

  useEffect(() => {
    if (!startTime) return;
    const calc = () => {
      const elapsed = Date.now() - new Date(startTime).getTime();
      setTimeLeft(PICKUP_WINDOW_MS - elapsed);
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  if (order.status !== 'READY') return null;
  if (!startTime || timeLeft === null) return null;

  const expired = timeLeft <= 0;
  const critical = !expired && timeLeft < 15 * 60 * 1000;
  const warning = !expired && !critical && timeLeft < 30 * 60 * 1000;

  const totalSecs = Math.max(0, Math.floor(timeLeft / 1000));
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  const pad = n => String(n).padStart(2, '0');
  const pct = Math.max(0, Math.min(100, (timeLeft / PICKUP_WINDOW_MS) * 100));

  const color = expired || critical ? '#FF4757' : warning ? '#FF8C42' : '#00e5a0';
  const bgColor = expired || critical ? 'rgba(255,71,87,0.08)' : warning ? 'rgba(255,140,66,0.08)' : 'rgba(0,229,160,0.06)';
  const borderColor = expired || critical ? 'rgba(255,71,87,0.35)' : warning ? 'rgba(255,140,66,0.35)' : 'rgba(0,229,160,0.2)';

  const R = 28;
  const CIRC = 2 * Math.PI * R;
  const dash = (pct / 100) * CIRC;

  return (
    <div style={{ marginBottom: 16, background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative', flexShrink: 0, width: 68, height: 68 }}>
        <svg width="68" height="68" viewBox="0 0 68 68" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="34" cy="34" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          <circle cx="34" cy="34" r={R} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={`${dash} ${CIRC}`}
            style={{ transition: 'stroke-dasharray 1s linear, stroke 0.4s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Clock size={18} style={{ color, transition: 'color 0.4s ease' }} />
        </div>
        {(critical || expired) && (
          <div style={{ position: 'absolute', top: 4, right: 4, width: 10, height: 10, borderRadius: '50%', background: '#FF4757', animation: 'timerPulse 1.2s ease-in-out infinite' }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color, letterSpacing: '0.08em', fontWeight: 700, marginBottom: 6 }}>
          {expired ? '⚠️ PICKUP WINDOW EXPIRED' : '⏱ TIME LEFT FOR PICKUP'}
        </div>
        {expired ? (
          <div style={{ fontSize: 13, color: '#FF4757', fontWeight: 600, lineHeight: 1.4 }}>
            Your assignment may be revoked.<br />
            <span style={{ fontSize: 11, color: 'rgba(255,71,87,0.7)', fontWeight: 400 }}>Contact support if this was delayed.</span>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 800, letterSpacing: '0.05em', color, lineHeight: 1, marginBottom: 6 }}>
              {hrs > 0 && <>{pad(hrs)}:</>}{pad(mins)}:{pad(secs)}
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 1s linear, background 0.4s ease' }} />
            </div>
            {warning && <div style={{ fontSize: 10, color: '#FF8C42', fontFamily: 'var(--font-mono)', marginTop: 5 }}>⚠️ Pick up soon to avoid revocation</div>}
            {critical && !expired && <div style={{ fontSize: 10, color: '#FF4757', fontFamily: 'var(--font-mono)', marginTop: 5, fontWeight: 700 }}>🚨 Head to pickup immediately!</div>}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Google Maps ─────────────────────────────────────────────────────────── */
const GMAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(window.google.maps); return; }
    const existing = document.getElementById('gmap-script');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps));
      existing.addEventListener('error', reject);
      return;
    }
    const s = document.createElement('script');
    s.id = 'gmap-script';
    s.src = `https://maps.googleapis.com/maps/api/js?key=${GMAP_KEY}`;
    s.async = true; s.defer = true;
    s.onload = () => resolve(window.google.maps);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function OrderMap({ order }) {
  const mapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const pLat = parseFloat(order.senderNode?.latitude);
  const pLng = parseFloat(order.senderNode?.longitude);
  const dLat = parseFloat(order.receiverNode?.latitude);
  const dLng = parseFloat(order.receiverNode?.longitude);

  useEffect(() => {
    if (!pLat || !pLng || !dLat || !dLng) return;
    loadGoogleMaps().then(maps => {
      const pickupPos = { lat: pLat, lng: pLng };
      const dropPos = { lat: dLat, lng: dLng };
      const map = new maps.Map(mapRef.current, {
        zoom: 13, center: pickupPos, disableDefaultUI: true, zoomControl: true,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#8a9bb0' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1117' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1c2433' }] },
          { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c3a4f' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#080e18' }] },
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        ],
      });
      new maps.Marker({
        position: pickupPos, map, title: 'Pickup',
        icon: { path: maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#00e5a0', fillOpacity: 1, strokeColor: '#131929', strokeWeight: 2 },
        label: { text: 'P', color: '#131929', fontSize: '10px', fontWeight: 'bold' },
      });
      new maps.Marker({
        position: dropPos, map, title: 'Drop',
        icon: { path: maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#ff4d6d', fillOpacity: 1, strokeColor: '#131929', strokeWeight: 2 },
        label: { text: 'D', color: '#fff', fontSize: '10px', fontWeight: 'bold' },
      });
      const dr = new maps.DirectionsService();
      const rr = new maps.DirectionsRenderer({
        map, suppressMarkers: true,
        polylineOptions: { strokeColor: '#e8ff47', strokeOpacity: 0.7, strokeWeight: 3 },
      });
      dr.route({ origin: pickupPos, destination: dropPos, travelMode: maps.TravelMode.DRIVING },
        (res, status) => {
          if (status === 'OK') rr.setDirections(res);
          else new maps.Polyline({ path: [pickupPos, dropPos], map, strokeColor: '#e8ff47', strokeOpacity: 0.5, strokeWeight: 2 });
        }
      );
      const bounds = new maps.LatLngBounds();
      bounds.extend(pickupPos); bounds.extend(dropPos);
      map.fitBounds(bounds, { top: 24, right: 24, bottom: 24, left: 24 });
      setReady(true);
    }).catch(() => { });
  }, [pLat, pLng, dLat, dLng]);

  if (!pLat || !pLng || !dLat || !dLng) return null;
  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', height: 200, marginBottom: 12 }}>
      {!ready && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'var(--bg-2)', zIndex: 1 }}><div className="loader" /></div>}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', bottom: 8, left: 8, zIndex: 2, background: 'rgba(13,17,23,0.85)', borderRadius: 8, padding: '4px 9px', display: 'flex', gap: 10, fontSize: 10, fontFamily: 'var(--font-mono)' }}>
        <span style={{ color: '#00e5a0' }}>● Pickup</span>
        <span style={{ color: '#ff4d6d' }}>● Drop</span>
      </div>
    </div>
  );
}

/* ─── Image Gallery ───────────────────────────────────────────────────────── */
function ImageGallery({ images, itemName }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  if (!images?.length) return null;
  const prev = (e) => { e.stopPropagation(); setCurrent(i => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setCurrent(i => (i + 1) % images.length); };
  return (
    <>
      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Images size={10} /> {images.length} PHOTO{images.length > 1 ? 'S' : ''}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {images.map((url, i) => (
            <div key={i} onClick={() => { setCurrent(i); setLightbox(true); }}
              style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${i === current ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`, flexShrink: 0, transition: 'border-color 0.15s' }}>
              <img src={url} alt={`img-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>
      {lightbox && (
        <div onClick={() => setLightbox(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={() => setLightbox(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 38, height: 38, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
          {images.length > 1 && <>
            <button onClick={prev} style={{ position: 'absolute', left: 12, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 38, height: 38, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={20} /></button>
            <button onClick={next} style={{ position: 'absolute', right: 12, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 38, height: 38, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={20} /></button>
          </>}
          <div style={{ textAlign: 'center', padding: '0 60px' }}>
            <img src={images[current]} alt="full" onClick={e => e.stopPropagation()}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 12 }} />
            {itemName && <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>{itemName}</div>}
          </div>
          {images.length > 1 && (
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
              {images.map((_, i) => (
                <div key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }}
                  style={{ width: i === current ? 20 : 6, height: 6, borderRadius: 3, background: i === current ? 'var(--accent)' : 'rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all 0.2s' }} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHandover, setShowHandover] = useState(false);
  const [showDeliver, setShowDeliver] = useState(false);
  // COD payment state — rider shows QR to customer
  const [codPayment, setCodPayment] = useState(null);
  const [codLoading, setCodLoading] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [blockedError, setBlockedError] = useState(null); // banner shown when rider is blocked/inactive
  const { guard, anyLoading: actionLoading } = useActionGuard();
  const { markOrderAccepted } = useNotifications();


  // Initial load — shows skeleton on first open
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const { data } = await ordersAPI.getById(id);
      setOrder(data?.data || data);
    } catch {
      toast.error('Failed to load order');
    } finally { setLoading(false); }
  };

  // Silent refresh after actions — updates state without showing skeleton
  const refreshOrder = async () => {
    try {
      const { data } = await ordersAPI.getById(id);
      setOrder(data?.data || data);
    } catch { /* silent — optimistic update already applied */ }
  };

  // Fetch COD payment data (QR + status) when order is COD.
  // useCallback so the stable reference can be safely used in useEffect deps.
  // NOTE: no early-return guard on paymentStatus here — always re-fetch when
  // called explicitly (e.g. after order:updated) so stale state never blocks.
  const fetchCodPayment = useCallback(async (orderData) => {
    if (!orderData || orderData.billing?.paymentMode !== 'COD') return;
    setCodLoading(true);
    try {
      const { data } = await ordersAPI.getPayment(orderData.orderId || id);
      const record = data?.data || data;
      setCodPayment(record);
    } catch { /* silent */ }
    finally { setCodLoading(false); }
  }, [id]);

  useEffect(() => { fetchOrder(); }, [id]);

  // Load COD payment on initial order load AND whenever billing status changes.
  // billing?.status changes PENDING→PAID when webhook fires + order:updated arrives.
  // order?.status alone is NOT enough — status stays DISPATCHED after COD payment.
  useEffect(() => {
    if (order) fetchCodPayment(order);
  }, [order?.status, order?.billing?.status, fetchCodPayment]);

  // Real-time: customer paid via QR/Pay Now
  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.orderId !== id) return;
      setCodPayment(prev => prev
        ? { ...prev, paymentStatus: 'PAID', paymentAt: new Date().toISOString() }
        : { paymentStatus: 'PAID', orderId: id });
      toast.success('💰 Customer paid digitally! Payment confirmed.', { duration: 4000 });
    };
    window.addEventListener('ws:cod:payment_received', handler);
    return () => window.removeEventListener('ws:cod:payment_received', handler);
  }, [id]);

  // ── Real-time: order:taken — another rider accepted this order first ────────
  useEffect(() => {
    const handler = (e) => {
      const { orderId } = e.detail || {};
      if (orderId !== id) return;
      // Update local state to reflect assigned state so Accept button disappears
      setOrder(prev => prev ? { ...prev, assignedRiderId: '__taken__' } : prev);
      toast('⚡ Another rider accepted this order first.', {
        icon: '🔒',
        duration: 4000,
        style: { background: '#1c2433', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      });
      // Navigate back after a short delay so rider sees the toast
      setTimeout(() => navigate('/orders'), 2000);
    };
    window.addEventListener('ws:order:taken', handler);
    return () => window.removeEventListener('ws:order:taken', handler);
  }, [id, navigate]);
  // ── Real-time: update this order page when status changes elsewhere ───────
  // e.g. sender marks package ready (PLACED → READY), admin cancels, deliver completes
  // Also handles: rider was revoked/dropped — order back to PLACED with no assignedRiderId
  // Also handles: COD billing marked PAID — order:updated now arrives after webhook
  useEffect(() => {
    const handler = (e) => {
      const updated = e.detail;
      if (!updated?.orderId || updated.orderId !== id) return;

      // If order flipped back to PLACED and this rider is no longer assigned,
      // it means we were revoked (by job or by dropping). Navigate away cleanly.
      if (
        updated.status === 'PLACED' &&
        order &&
        ['READY', 'DISPATCHED'].includes(order.status) &&
        !updated.assignedRiderId
      ) {
        toast('📦 Order returned to pool — finding another rider', {
          icon: '🔄',
          style: { background: '#1c2433', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
          duration: 4000,
        });
        navigate('/orders');
        return;
      }

      setOrder(prev => prev ? { ...prev, ...updated } : updated);

      // If billing status changed to PAID (COD webhook fired), re-fetch
      // codPayment immediately so the QR card and OTP button update at once.
      const prevBillingStatus = order?.billing?.status;
      const nextBillingStatus = updated?.billing?.status;
      if (
        updated.billing?.paymentMode === 'COD' &&
        nextBillingStatus === 'PAID' &&
        prevBillingStatus !== 'PAID'
      ) {
        fetchCodPayment(updated);
      }
    };

    window.addEventListener('ws:order:updated', handler);
    return () => window.removeEventListener('ws:order:updated', handler);
  }, [id, order, navigate, fetchCodPayment]);

  const handleAction = (action, extra) => {
    guard(async () => {
      log.action(`order_${action}`, { orderId: id, action });
      if (action === 'accept') {
        const { data: res } = await ordersAPI.accept(id);
        // Immediately apply the response — backend returns updated order with
        // new status (READY if sender already marked ready, else PLACED with
        // assignedRiderId set) AND the pickupOtp for the rider
        const updated = res?.data || res;
        if (updated) setOrder(updated);
        markOrderAccepted(id); // clear alert + block re-trigger
        toast.success(res?.message || 'Order accepted! 🎉');
      } else if (action === 'deliver') {
        await ordersAPI.deliver(id, extra);
        toast.success('Delivered! Great work 🚀');
        setShowDeliver(false);
      } else if (action === 'cancel') {
        await ordersAPI.cancelDelivery(id, extra);
        toast.success('Order returned to pool. Other riders will be notified. 🔄');
        setShowCancel(false);
      }
      // Silent background refresh to confirm server state (no skeleton flash)
      await refreshOrder();
    }, action).catch(err => {
      const data = err.response?.data;
      const msg = data?.message
        || data?.error
        || data?.details
        || (typeof data === 'string' ? data : null)
        || err.message
        || 'Action failed';
      log.error(`order_${action} failed`, { msg, status: err.response?.status, data });

      if (action === 'accept') {
        // Another rider already accepted — update UI and navigate away cleanly
        if (/already been accepted|no longer available|not available/i.test(msg) || err.response?.status === 403) {
          setOrder(prev => prev ? { ...prev, assignedRiderId: '__taken__' } : prev);
          toast('⚡ Another rider accepted this order first.', {
            icon: '🔒',
            duration: 4000,
            style: { background: '#1c2433', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
          });
          setTimeout(() => navigate('/orders'), 2000);
          return;
        }
        // Blocked / inactive rider — show persistent banner
        if (/blocked|inactive/i.test(msg)) {
          setBlockedError(msg);
          return;
        }
      }

      toast.error(msg, { duration: 5000 });
    })
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <div className="skeleton" style={{ width: 34, height: 34, borderRadius: 8 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="skeleton" style={{ width: 120, height: 18, borderRadius: 6 }} />
          <div className="skeleton" style={{ width: 80, height: 11, borderRadius: 4 }} />
        </div>
      </div>
      <div className="skeleton" style={{ width: '100%', height: 64, borderRadius: 12 }} />
      <div className="skeleton" style={{ width: '100%', height: 200, borderRadius: 12 }} />
      <SkeletonCard rows={3} />
      <SkeletonCard rows={3} />
    </div>
  );

  if (!order) return (
    <div style={{ textAlign: 'center', padding: 48 }}>
      <Package size={36} style={{ color: 'var(--text-2)', marginBottom: 12 }} />
      <div style={{ color: 'var(--text-2)', marginBottom: 16 }}>Order not found</div>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/orders')}><ArrowLeft size={14} /> Back</button>
    </div>
  );

  const status = order.status;
  const pickupAddr = [order.senderNode?.buildingOrFlat, order.senderNode?.street, order.senderNode?.area, order.senderNode?.city].filter(Boolean).join(', ');
  const dropAddr = [order.receiverNode?.buildingOrFlat, order.receiverNode?.street, order.receiverNode?.area, order.receiverNode?.city].filter(Boolean).join(', ');
  const hasCoords = order.senderNode?.latitude && order.receiverNode?.latitude;
  const statusMap = { PLACED: 'blue', DISPATCHED: 'orange', DELIVERED: 'green', CANCELLED: 'red', DRAFT: 'neutral' };

  return (
    <div>

      {/* Header */}
      <div className="flex items-center justify-between mb-16">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" style={{ padding: 8 }} onClick={() => navigate('/orders')}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Order Details</div>
            <div className="code" style={{ fontSize: 11, color: 'var(--text-2)' }}>#{(order.orderId || order.id || '').slice(-12).toUpperCase()}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`badge ${statusMap[status] || 'neutral'}`}>{status}</span>
          <button className="btn btn-ghost btn-sm" style={{ padding: 8 }} onClick={fetchOrder}><RefreshCw size={14} /></button>
        </div>
      </div>

      {/* Status stepper */}
      <StatusStepper status={status} />

      {/* Pickup countdown timer — visible when order is READY and rider hasn't picked up yet */}
      <PickupCountdownTimer order={order} />

      {/* Map */}
      {hasCoords && <OrderMap order={order} />}

      {/* Navigate buttons */}
      {hasCoords && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${order.senderNode.latitude},${order.senderNode.longitude}&travelmode=driving`, '_blank')}>
            <Navigation size={13} style={{ color: '#00e5a0' }} /> To Pickup
          </button>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${order.receiverNode.latitude},${order.receiverNode.longitude}&travelmode=driving`, '_blank')}>
            <Navigation size={13} style={{ color: '#ff4d6d' }} /> To Drop
          </button>
        </div>
      )}

      {/* Pickup OTP — READY: show large OTP for rider to read to sender */}
      {status === 'READY' && order.pickupOtp && (
        <div className="otp-display-card" style={{ marginBottom: 16 }}>
          <div className="otp-display-label">📦 Pickup OTP — Tell This to Sender</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12, lineHeight: 1.5 }}>
            Read this OTP to the sender. They will enter it in their app to confirm handover.
          </div>
          <div className="otp-display-code">{order.pickupOtp}</div>
        </div>
      )}

      {/* DISPATCHED: pickup OTP confirmed reference */}
      {status === 'DISPATCHED' && order.pickupOtp && (
        <div style={{ marginBottom: 12, background: 'rgba(0,229,160,0.06)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: 12, padding: '10px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.06em', marginBottom: 4 }}>PICKUP OTP (confirmed)</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.15em' }}>{order.pickupOtp}</div>
        </div>
      )}

      {/* Pickup Address */}
      <div className="card" style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.06em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e5a0' }} /> PICKUP
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{order.senderNode?.contactPerson || '—'}</div>
        <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.5, marginBottom: 8 }}>{pickupAddr || '—'}</div>
        {order.senderNode?.contactNumber && (
          <a href={`tel:${order.senderNode.contactNumber}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--accent)', textDecoration: 'none', fontFamily: 'var(--font-mono)', background: 'var(--accent-dim)', padding: '6px 12px', borderRadius: 8 }}>
            <Phone size={13} /> {order.senderNode.contactNumber}
          </a>
        )}
      </div>

      {/* Drop Address */}
      <div className="card" style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#ff4d6d', letterSpacing: '0.06em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4d6d' }} /> DROP
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{order.receiverNode?.contactPerson || order.receiverUser?.firstName || '—'}</div>
        <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.5, marginBottom: 8 }}>{dropAddr || '—'}</div>
        {order.receiverNode?.contactNumber && (
          <a href={`tel:${order.receiverNode.contactNumber}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#ff4d6d', textDecoration: 'none', fontFamily: 'var(--font-mono)', background: 'rgba(255,77,109,0.1)', padding: '6px 12px', borderRadius: 8 }}>
            <Phone size={13} /> {order.receiverNode.contactNumber}
          </a>
        )}
      </div>

      {/* Sender & Receiver Details */}
      <div className="card" style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', letterSpacing: '0.06em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
          <Hash size={11} /> PEOPLE
        </div>

        {/* Sender */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#00e5a0', letterSpacing: '0.08em', marginBottom: 6 }}>SENDER</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                {[order.sender?.firstName, order.sender?.lastName].filter(Boolean).join(' ') || order.senderNode?.contactPerson || '—'}
              </div>
              {order.sender?.phoneNumber && (
                <div style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{order.sender.phoneNumber}</div>
              )}
            </div>
            {order.sender?.phoneNumber && (
              <a
                href={`tel:${order.sender.phoneNumber}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '50%', background: 'var(--accent-dim)', color: 'var(--accent)', textDecoration: 'none', flexShrink: 0 }}
              >
                <Phone size={15} />
              </a>
            )}
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 12 }} />

        {/* Receiver */}
        <div>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#ff4d6d', letterSpacing: '0.08em', marginBottom: 6 }}>RECEIVER</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                {[order.receiver?.firstName, order.receiver?.lastName].filter(Boolean).join(' ') || order.receiverNode?.contactPerson || '—'}
              </div>
              {order.receiver?.phoneNumber && (
                <div style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{order.receiver.phoneNumber}</div>
              )}
            </div>
            {order.receiver?.phoneNumber && (
              <a
                href={`tel:${order.receiver.phoneNumber}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,77,109,0.1)', color: '#ff4d6d', textDecoration: 'none', flexShrink: 0 }}
              >
                <Phone size={15} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Items with Images */}
      {order.items?.length > 0 && (
        <div className="card" style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', letterSpacing: '0.06em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Package size={11} /> ITEMS ({order.items.length})
          </div>
          {order.items.map((item, i) => (
            <div key={i} style={{ paddingBottom: i < order.items.length - 1 ? 14 : 0, marginBottom: i < order.items.length - 1 ? 14 : 0, borderBottom: i < order.items.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name || `Item ${i + 1}`}</div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {item.quantity > 1 && <span className="badge neutral" style={{ fontSize: 10 }}>×{item.quantity}</span>}
                  {item.size && <span className="badge neutral" style={{ fontSize: 10 }}>{item.size}</span>}
                </div>
              </div>
              {(item.type || item.category) && (
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>
                  {[item.type, item.category].filter(Boolean).join(' · ')}
                </div>
              )}
              <ImageGallery images={item.images} itemName={item.name} />
            </div>
          ))}
        </div>
      )}

      {/* ── COD Payment Card — Rider shows QR to customer ── */}
      {order.billing?.paymentMode === 'COD' && !['CANCELLED'].includes(status) && (
        <div className="card" style={{
          marginBottom: 10,
          borderColor: codPayment?.paymentStatus === 'PAID' ? 'rgba(22,163,74,0.4)' : 'rgba(245,158,11,0.35)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Banknote size={16} style={{ color: codPayment?.paymentStatus === 'PAID' ? 'var(--green)' : 'var(--orange)' }} />
            <span style={{
              fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 700,
              color: codPayment?.paymentStatus === 'PAID' ? 'var(--green)' : 'var(--orange)'
            }}>
              {codPayment?.paymentStatus === 'PAID' ? 'PAYMENT RECEIVED ✅' : 'COD — PAYMENT PENDING'}
            </span>
            {codLoading && <div className="loader" style={{ width: 12, height: 12, marginLeft: 'auto' }} />}
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 12
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Amount</span>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
              color: codPayment?.paymentStatus === 'PAID' ? 'var(--green)' : 'var(--text-0)'
            }}>
              ₹{Number(codPayment?.amount || order.billing?.payableAmount || 0).toFixed(2)}
            </span>
          </div>

          {codPayment?.paymentStatus === 'PAID' ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
              background: 'rgba(22,163,74,0.1)', borderRadius: 10, border: '1px solid rgba(22,163,74,0.25)'
            }}>
              <span style={{ fontSize: 22 }}>💰</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>Customer paid digitally</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                  {codPayment?.razorpayPaymentId ? `Ref: ${codPayment.razorpayPaymentId.slice(-8).toUpperCase()}` : ''}
                  {codPayment?.paymentAt
                    ? ` · ${new Date(codPayment.paymentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`
                    : ''}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12, lineHeight: 1.5 }}>
                Show this QR to the customer. They can scan it with any UPI app to pay digitally.
                Payment confirmation appears automatically.
              </div>

              <button
                onClick={() => {
                  setShowQr(v => !v);
                  if (!codPayment && !codLoading) fetchCodPayment(order);
                }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, padding: '10px 0', borderRadius: 10,
                  border: '1.5px dashed rgba(245,158,11,0.5)',
                  background: showQr ? 'rgba(245,158,11,0.08)' : 'transparent',
                  color: 'var(--orange)', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font-mono)',
                  marginBottom: showQr ? 14 : 0
                }}
              >
                <QrCode size={15} />
                {showQr ? 'Hide QR Code' : 'Show QR Code to Customer'}
              </button>

              {showQr && (
                <div style={{ textAlign: 'center' }}>
                  {codLoading ? (
                    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <div className="loader" />
                      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Loading QR…</span>
                    </div>
                  ) : codPayment?.qrCodeImageUrl ? (
                    <>
                      <div style={{
                        display: 'inline-block', padding: 12, background: '#fff',
                        borderRadius: 14, border: '2px solid rgba(255,255,255,0.15)', marginBottom: 8
                      }}>
                        <img src={codPayment.qrCodeImageUrl} alt="UPI QR"
                          style={{ width: 200, height: 200, display: 'block' }} />
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                        PhonePe · GPay · Paytm · BHIM · Any UPI app
                      </div>
                      {codPayment.qrExpiresAt && (
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          gap: 4, marginTop: 6, fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)'
                        }}>
                          <Clock size={10} />
                          Valid till {new Date(codPayment.qrExpiresAt * 1000)
                            .toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ padding: 16, fontSize: 12, color: 'var(--text-2)' }}>
                      QR unavailable. Ask customer to pay cash.
                    </div>
                  )}
                </div>
              )}

              <div style={{
                display: 'flex', alignItems: 'center', gap: 6, marginTop: 12,
                padding: '8px 12px', background: 'rgba(245,158,11,0.08)',
                borderRadius: 8, fontSize: 11, color: 'var(--orange)', fontFamily: 'var(--font-mono)'
              }}>
                <Clock size={11} />
                Waiting for customer payment · Updates automatically
              </div>
            </>
          )}
        </div>
      )}

      {/* Order Info */}
      <div className="card" style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', letterSpacing: '0.06em', marginBottom: 12 }}>ORDER INFO</div>
        {[
          { label: 'Payment', value: order.billing?.paymentMode || order.paymentMode },
          {
            label: 'Pay Status', value: order.billing?.paymentMode === 'COD'
              ? (codPayment?.paymentStatus === 'PAID' ? '✅ Paid Digitally' : '⏳ Pending')
              : null
          },
          { label: 'Amount', value: order.billing?.payableAmount ? `₹${Number(order.billing.payableAmount).toFixed(2)}` : null },
          { label: 'Distance', value: order.billing?.totalDistance ? `${Number(order.billing.totalDistance).toFixed(1)} km` : null },
          { label: 'Self Handling', value: order.isSelfHandling ? 'Yes' : 'No' },
          { label: 'Created', value: order.createdAt ? new Date(order.createdAt).toLocaleString() : null },
        ].filter(r => r.value).map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
            <span style={{ fontSize: 13, color: 'var(--text-0)', fontFamily: 'var(--font-mono)' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* ── Blocked rider banner — in page flow, above sticky bar ── */}
      {blockedError && status === 'PLACED' && !order?.assignedRiderId && (
        <div style={{
          margin: '0 0 12px 0',
          padding: '12px 14px',
          borderRadius: 12,
          background: 'rgba(220,38,38,0.10)',
          border: '1.5px solid rgba(220,38,38,0.45)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🚫</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#ff4d6d' }}>
              Order Accept Nahi Ho Sakta
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#000000', lineHeight: 1.55, paddingLeft: 26 }}>
            Aapka account <strong style={{ color: '#ff4d6d' }}>block</strong> hai ya inactive hai.
            Naye orders accept karne ke liye admin se contact karein.
          </div>
          <div style={{
            marginTop: 2,
            paddingLeft: 26,
            fontSize: 11,
            color: 'rgba(255,77,109,0.6)',
            fontFamily: 'var(--font-mono)',
          }}>
            {blockedError}
          </div>
        </div>
      )}

      {/* Bottom padding for sticky bar */}
      <div style={{ height: 90 }} />

      {/* ── Full-screen OTP Modals ── */}
      {showDeliver && (
        <OTPModal
          type="delivery"
          loading={actionLoading}
          onSubmit={otp => handleAction('deliver', otp)}
          onCancel={() => setShowDeliver(false)}
        />
      )}

      {/* Cancel form (inline, not full-screen) */}
      {showCancel && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(5,8,15,0.96)', backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '0 24px',
        }}>
          <div style={{
            width: '100%', maxWidth: 360,
            background: 'var(--bg-1)', border: '1px solid var(--border)',
            borderRadius: 20, padding: 24,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Drop This Order</div>
            <div style={{
              fontSize: 13, color: 'var(--text-2)', marginBottom: 10, lineHeight: 1.6,
            }}>
              The order will <strong style={{ color: 'var(--text-0)' }}>not be cancelled</strong>. It will go back to the pool and other riders will be notified to pick it up.
            </div>
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              background: 'rgba(255,140,66,0.08)', border: '1px solid rgba(255,140,66,0.25)',
              borderRadius: 10, padding: '10px 12px', marginBottom: 16,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
              <div style={{ fontSize: 12, color: 'var(--orange)', lineHeight: 1.5 }}>
                Dropping orders repeatedly may affect your standing. Only drop if necessary.
              </div>
            </div>
            <textarea
              className="form-textarea"
              placeholder="Reason for dropping (optional)..."
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              style={{ minHeight: 80, width: '100%', marginBottom: 14 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCancel(false)}>Keep Order</button>
              <button className="btn btn-danger" style={{ flex: 1 }} disabled={actionLoading} onClick={() => handleAction('cancel', cancelReason)}>
                Drop Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky action bar ── */}
      {!showDeliver && !showCancel && (
        <div className="sticky-action-bar">
          {status === 'PLACED' && !order?.assignedRiderId && (
            <button
              className="btn btn-primary"
              style={{ flex: 1, opacity: blockedError ? 0.45 : 1 }}
              disabled={actionLoading || !!blockedError}
              onClick={() => { setBlockedError(null); handleAction('accept'); }}
            >
              <Truck size={15} /> Accept Order
            </button>
          )}
          {status === 'PLACED' && order?.assignedRiderId && (
            // Rider accepted — waiting for sender to mark package ready
            // Drop Order button is active so rider can back out if needed
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{
                textAlign: 'center',
                padding: '10px 14px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.5)',
                fontSize: 13, fontWeight: 500,
                lineHeight: 1.5,
              }}>
                ⏳ Waiting for sender to mark package ready…
              </div>
              <button
                className="btn btn-danger"
                style={{ flex: 1 }}
                onClick={() => setShowCancel(true)}
              >
                <X size={15} /> Drop Order
              </button>
            </div>
          )}
          {status === 'READY' && (
            <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => setShowCancel(true)}>
              <X size={15} /> Drop Order
            </button>
          )}
          {status === 'DISPATCHED' && (
            <>
              {order.billing?.paymentMode === 'COD' && codPayment?.paymentStatus !== 'PAID' ? (
                /* ── COD payment not yet received — block OTP entry ── */
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{
                    padding: '11px 14px', borderRadius: 12,
                    background: 'rgba(245,158,11,0.10)',
                    border: '1px solid rgba(245,158,11,0.35)',
                    fontSize: 12, color: 'var(--orange)',
                    fontWeight: 600, textAlign: 'center', lineHeight: 1.5,
                  }}>
                    ⚠️ Payment pending — show the QR code to the customer and wait for confirmation before delivering.
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1, opacity: 0.4, cursor: 'not-allowed' }}
                      disabled
                    >
                      <CheckCircle size={15} /> Enter Drop OTP
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => setShowCancel(true)}>
                      <X size={15} />
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Payment received (or non-COD) — allow OTP entry ── */
                <>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => { setShowDeliver(true); setShowHandover(false); }}
                  >
                    <CheckCircle size={15} /> Enter Drop OTP
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => setShowCancel(true)}>
                    <X size={15} />
                  </button>
                </>
              )}
            </>
          )}
          {['DELIVERED', 'CANCELLED'].includes(status) && (
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/orders')}>
              <ArrowLeft size={15} /> Back to Orders
            </button>
          )}
        </div>
      )}
    </div>
  );
}