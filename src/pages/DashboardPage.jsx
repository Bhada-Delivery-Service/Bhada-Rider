import React, { useState, useEffect, useRef } from 'react';
import { Bike, Package, Star, TrendingUp, Coffee, Wifi, WifiOff, RefreshCw, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';
import { ridersAPI, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../services/socketService';
import { startTracking, stopTracking } from '../services/locationService';

const statusConfig = {
  ONLINE:  { label: 'Online', color: 'online', dot: 'green' },
  OFFLINE: { label: 'Offline', color: 'offline', dot: 'red' },
  ON_BREAK:{ label: 'On Break', color: 'break', dot: 'orange' },
};

export default function DashboardPage() {
  const { user, rider, updateRider } = useAuth();
  const [riderData, setRiderData]       = useState(rider || null);
  const [performance, setPerformance]   = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loading, setLoading]           = useState(true);
  const [tracking, setTracking]         = useState(false);
  const trackingRef = useRef(false);

  const fetchData = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const [riderRes, perfRes] = await Promise.allSettled([
        ridersAPI.getById(user.uid),
        ridersAPI.getPerformance(user.uid),
      ]);
      if (riderRes.status === 'fulfilled') {
        const rd = riderRes.value.data?.data || riderRes.value.data;
        setRiderData(rd);
        updateRider(rd);
        // Auto-start tracking if rider is online
        const status = rd?.riderAvailabilityStatus || rd?.status;
        handleTrackingForStatus(status);
      }
      if (perfRes.status === 'fulfilled') {
        setPerformance(perfRes.value.data?.data || perfRes.value.data);
      }
    } catch (_) {
      toast.error('Failed to load rider data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user?.uid]);

  // Cleanup tracking on unmount
  useEffect(() => {
    return () => {
      if (trackingRef.current) stopTracking();
    };
  }, []);

  const handleTrackingForStatus = (status) => {
    const socket = getSocket();
    const shouldTrack = status === 'ONLINE' || status === 'AVAILABLE';
    if (shouldTrack && !trackingRef.current && socket) {
      startTracking(socket);
      trackingRef.current = true;
      setTracking(true);
    } else if (!shouldTrack && trackingRef.current) {
      stopTracking();
      trackingRef.current = false;
      setTracking(false);
    }
  };

  const changeStatus = async (action) => {
    if (!user?.uid) return;
    setLoadingStatus(true);
    try {
      let res;
      if (action === 'online')  res = await ridersAPI.goOnline(user.uid);
      else if (action === 'offline') res = await ridersAPI.goOffline(user.uid);
      else if (action === 'break')   res = await ridersAPI.takeBreak(user.uid);
      else if (action === 'resume')  res = await ridersAPI.resume(user.uid);

      const updated = res.data?.data || res.data;
      if (updated) {
        setRiderData(updated);
        updateRider(updated);
        const status = updated?.riderAvailabilityStatus || updated?.status;
        handleTrackingForStatus(status);
      }
      toast.success('Status updated');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally { setLoadingStatus(false); }
  };

  const currentStatus = riderData?.riderAvailabilityStatus || riderData?.status || 'OFFLINE';
  const statusCfg = statusConfig[currentStatus] || statusConfig.OFFLINE;
  const notApproved = riderData && riderData.onboardingStatus !== 'APPROVED';

  if (loading) return <div className="loading-center"><div className="loader" /></div>;

  return (
    <div>
      {/* Greeting */}
      <div className="flex items-center justify-between mb-16">
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Good day,</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {riderData?.firstName || user?.phoneNumber || 'Rider'} 👋
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchData} style={{ padding: '8px' }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Onboarding warning */}
      {notApproved && (
        <div className="card mb-12" style={{ background: 'var(--orange-dim)', borderColor: 'rgba(255,154,60,0.2)', marginBottom: 12 }}>
          <div className="flex items-center gap-10">
            <Bike size={18} style={{ color: 'var(--orange)', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--orange)', fontSize: 14 }}>Onboarding Pending</div>
              <div style={{ fontSize: 12, color: 'var(--text-1)', marginTop: 2 }}>
                Status: <span className="font-mono" style={{ color: 'var(--text-0)' }}>{riderData?.onboardingStatus || 'NOT_SUBMITTED'}</span> — Complete your profile to go online.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status card */}
      <div className="card mb-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 6, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Availability</div>
            <span className={`status-pill ${statusCfg.color}`}>
              <span className={`status-dot ${statusCfg.dot}`} />
              {statusCfg.label}
            </span>
          </div>
          {!notApproved && (
            <div className="flex gap-6">
              {currentStatus === 'OFFLINE' && (
                <button className="btn btn-primary btn-sm" onClick={() => changeStatus('online')} disabled={loadingStatus}>
                  <Wifi size={13} /> Go Online
                </button>
              )}
              {(currentStatus === 'ONLINE' || currentStatus === 'AVAILABLE') && (
                <>
                  <button className="btn btn-secondary btn-sm" onClick={() => changeStatus('break')} disabled={loadingStatus}>
                    <Coffee size={13} /> Break
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => changeStatus('offline')} disabled={loadingStatus}>
                    <WifiOff size={13} /> Offline
                  </button>
                </>
              )}
              {currentStatus === 'ON_BREAK' && (
                <>
                  <button className="btn btn-primary btn-sm" onClick={() => changeStatus('resume')} disabled={loadingStatus}>
                    <Wifi size={13} /> Resume
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => changeStatus('offline')} disabled={loadingStatus}>
                    <WifiOff size={13} /> Offline
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Tracking indicator */}
        {(currentStatus === 'ONLINE' || currentStatus === 'AVAILABLE') && (
          <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
              ● You are visible to customers and receiving orders
            </span>
            {tracking && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.2)',
                borderRadius: 6, padding: '2px 7px', fontSize: 10,
                color: 'var(--accent)', fontFamily: 'var(--font-mono)',
              }}>
                <Navigation size={9} style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                TRACKING
              </span>
            )}
          </div>
        )}
        {currentStatus === 'OFFLINE' && (
          <div style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
            ○ You are offline. Go online to receive orders.
          </div>
        )}
        {currentStatus === 'ON_BREAK' && (
          <div style={{ fontSize: 12, color: 'var(--orange)', fontFamily: 'var(--font-mono)' }}>
            ◐ You are on a break. Resume when ready.
          </div>
        )}
      </div>

      {/* Performance metrics */}
      {performance && (
        <div className="card mb-12">
          <div className="section-header" style={{ marginBottom: 12 }}>
            <TrendingUp size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle', color: 'var(--accent)' }} />
            Performance
          </div>
          <div className="metric-row">
            <div className="metric-card">
              <div className="metric-label">Deliveries</div>
              <div className="metric-value">{performance?.totalDeliveries ?? 0}</div>
              <div className="metric-sub">All time</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Rating</div>
              <div className="metric-value" style={{ color: 'var(--orange)' }}>
                ★ {(performance?.rating ?? performance?.averageRating)?.toFixed(1) ?? '—'}
              </div>
              <div className="metric-sub">{performance?.totalRatingsCount ?? performance?.totalRatings ?? 0} reviews</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Success</div>
              <div className="metric-value" style={{ color: 'var(--accent)' }}>
                {performance?.successRate != null ? `${performance.successRate}%` : '—'}
              </div>
              <div className="metric-sub">Completion</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Earnings</div>
              <div className="metric-value" style={{ color: 'var(--green)', fontSize: 13 }}>
                ₹{(performance?.totalEarnings ?? 0).toLocaleString('en-IN')}
              </div>
              <div className="metric-sub">Total</div>
            </div>
          </div>
        </div>
      )}

      {/* Available orders */}
      {(currentStatus === 'ONLINE' || currentStatus === 'AVAILABLE') && (
        <div className="card">
          <div className="flex items-center justify-between mb-12">
            <div className="section-header" style={{ marginBottom: 0 }}>
              <Package size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle', color: 'var(--blue)' }} />
              Available Orders
            </div>
            <span className="badge blue">{availableOrders.length}</span>
          </div>
          {availableOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-2)', fontSize: 13 }}>
              No orders available right now
            </div>
          ) : (
            <div>
              {availableOrders.slice(0, 3).map(order => (
                <div key={order.orderId || order.id} className="flex items-center justify-between"
                  style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <span className="code">#{(order.orderId || order.id || '').slice(-8)}</span>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 3 }}>
                      {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <span className="badge blue">PLACED</span>
                </div>
              ))}
              {availableOrders.length > 3 && (
                <div style={{ fontSize: 12, color: 'var(--text-2)', textAlign: 'center', marginTop: 10 }}>
                  +{availableOrders.length - 3} more — check Orders tab
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
