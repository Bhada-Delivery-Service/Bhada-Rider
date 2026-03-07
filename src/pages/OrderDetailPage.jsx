import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Package, MapPin, Navigation, CheckCircle,
  Truck, KeyRound, X, Images, ChevronLeft, ChevronRight,
  Phone, Hash, RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersAPI } from '../services/api';
import { useActionGuard } from '../hooks/useActionGuard';
import { logger } from '../utils/logger';
import StatusStepper from '../components/ui/StatusStepper';
import OTPModal from '../components/order/OTPModal';
import { SkeletonCard } from '../components/ui/SkeletonLoader';

const log = logger('OrderDetail');

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
      const dropPos   = { lat: dLat, lng: dLng };
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
      new maps.Marker({ position: pickupPos, map, title: 'Pickup',
        icon: { path: maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#00e5a0', fillOpacity: 1, strokeColor: '#131929', strokeWeight: 2 },
        label: { text: 'P', color: '#131929', fontSize: '10px', fontWeight: 'bold' },
      });
      new maps.Marker({ position: dropPos, map, title: 'Drop',
        icon: { path: maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#ff4d6d', fillOpacity: 1, strokeColor: '#131929', strokeWeight: 2 },
        label: { text: 'D', color: '#fff', fontSize: '10px', fontWeight: 'bold' },
      });
      const dr = new maps.DirectionsService();
      const rr = new maps.DirectionsRenderer({ map, suppressMarkers: true,
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
    }).catch(() => {});
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
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const { guard, anyLoading: actionLoading } = useActionGuard();

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const { data } = await ordersAPI.getById(id);
      setOrder(data?.data || data);
    } catch {
      toast.error('Failed to load order');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  // ── Real-time: update this order page when status changes elsewhere ───────
  // e.g. sender marks package ready (PLACED → READY), admin cancels, deliver completes
  useEffect(() => {
    const handler = (e) => {
      const updated = e.detail;
      if (!updated?.orderId || updated.orderId !== id) return;
      setOrder(prev => prev ? { ...prev, ...updated } : updated);
    };
    window.addEventListener('ws:order:updated', handler);
    return () => window.removeEventListener('ws:order:updated', handler);
  }, [id]);

  const handleAction = (action, extra) => {
    guard(async () => {
      log.action(`order_${action}`, { orderId: id, action });
      if (action === 'accept') {
        await ordersAPI.accept(id);
        toast.success('Order accepted! 🎉');
      } else if (action === 'deliver') {
        await ordersAPI.deliver(id, extra);
        toast.success('Delivered! Great work 🚀');
        setShowDeliver(false);
      } else if (action === 'cancel') {
        await ordersAPI.cancelDelivery(id, extra);
        toast.success('Delivery cancelled');
        setShowCancel(false);
      }
      fetchOrder();
    }, action).catch(err => {
      toast.error(err.response?.data?.message || err.message || 'Action failed');
      log.error(`order_${action} failed`, err);
    });
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

  const status     = order.status;
  const pickupAddr = [order.senderNode?.buildingOrFlat, order.senderNode?.street, order.senderNode?.area, order.senderNode?.city].filter(Boolean).join(', ');
  const dropAddr   = [order.receiverNode?.buildingOrFlat, order.receiverNode?.street, order.receiverNode?.area, order.receiverNode?.city].filter(Boolean).join(', ');
  const hasCoords  = order.senderNode?.latitude && order.receiverNode?.latitude;
  const statusMap  = { PLACED: 'blue', DISPATCHED: 'orange', DELIVERED: 'green', CANCELLED: 'red', DRAFT: 'neutral' };

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

      {/* Order Info */}
      <div className="card" style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', letterSpacing: '0.06em', marginBottom: 12 }}>ORDER INFO</div>
        {[
          { label: 'Payment',  value: order.billing?.paymentMode || order.paymentMode },
          { label: 'Amount',   value: order.billing?.payableAmount ? `₹${Number(order.billing.payableAmount).toFixed(2)}` : null },
          { label: 'Distance', value: order.billing?.totalDistance ? `${Number(order.billing.totalDistance).toFixed(1)} km` : null },
          { label: 'Self Handling', value: order.isSelfHandling ? 'Yes' : 'No' },
          { label: 'Created',  value: order.createdAt ? new Date(order.createdAt).toLocaleString() : null },
        ].filter(r => r.value).map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
            <span style={{ fontSize: 13, color: 'var(--text-0)', fontFamily: 'var(--font-mono)' }}>{value}</span>
          </div>
        ))}
      </div>

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
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Cancel Delivery</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>Let us know why you need to cancel this delivery.</div>
            <textarea
              className="form-textarea"
              placeholder="Reason (optional)..."
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              style={{ minHeight: 88, width: '100%', marginBottom: 14 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCancel(false)}>Back</button>
              <button className="btn btn-danger" style={{ flex: 1 }} disabled={actionLoading} onClick={() => handleAction('cancel', cancelReason)}>
                Cancel Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky action bar ── */}
      {!showDeliver && !showCancel && (
        <div className="sticky-action-bar">
          {status === 'PLACED' && (
            <>
              <button className="btn btn-primary" style={{ flex: 1 }} disabled={actionLoading} onClick={() => handleAction('accept')}>
                <Truck size={15} /> Accept Order
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => setShowCancel(true)}><X size={15} /></button>
            </>
          )}
          {status === 'READY' && (
            <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => setShowCancel(true)}>
              <X size={15} /> Cancel Delivery
            </button>
          )}
          {status === 'DISPATCHED' && (
            <>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setShowDeliver(true); setShowHandover(false); }}>
                <CheckCircle size={15} /> Enter Drop OTP
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => setShowCancel(true)}><X size={15} /></button>
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