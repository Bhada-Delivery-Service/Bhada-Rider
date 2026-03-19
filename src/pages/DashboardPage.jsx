import React, { memo } from 'react';
import { useLang } from '../context/LangContext';
import { Bike, Package, TrendingUp, Coffee, Wifi, WifiOff, RefreshCw, Navigation, IndianRupee, Star, Zap } from 'lucide-react';
import { useRiderStatus }    from '../hooks/useRiderStatus';
import { useOrders }         from '../hooks/useOrders';
import { useNetworkStatus }  from '../hooks/useNetworkStatus';
import { SkeletonDashboard } from '../components/ui/SkeletonLoader';

function getStatusConfig(t) {
  return {
    ONLINE:    { label: t('status_online'),   color: 'online',  dot: 'green'  },
    AVAILABLE: { label: t('status_online'),   color: 'online',  dot: 'green'  },
    OFFLINE:   { label: t('status_offline'),  color: 'offline', dot: 'red'    },
    ON_BREAK:  { label: t('status_on_break'), color: 'break',   dot: 'orange' },
    BUSY:      { label: t('status_busy'),     color: 'online',  dot: 'green'  },
  };
}

const MetricCard = memo(function MetricCard({ icon: Icon, label, value, sub, valueColor }) {
  return (
    <div className="metric-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
        {Icon && <Icon size={11} style={{ color: 'var(--text-2)' }} />}
        <div className="metric-label" style={{ marginBottom: 0 }}>{label}</div>
      </div>
      <div className="metric-value" style={{ color: valueColor || 'var(--text-0)' }}>{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
});

const PerformanceSection = memo(function PerformanceSection({ performance, t }) {
  if (!performance) return null;
  return (
    <div className="card mb-12">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 30, height: 30, borderRadius: 'var(--r-sm)', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TrendingUp size={15} style={{ color: 'var(--accent)' }} />
        </div>
        <div className="section-header" style={{ marginBottom: 0 }}>{t('performance')}</div>
      </div>
      <div className="metric-row-4">
        <MetricCard icon={Package}     label={t('orders_label')}   value={performance?.totalDeliveries ?? 0} sub={t('all_time')} />
        <MetricCard icon={Star}        label={t('rating_label')}   value={`★ ${(performance?.rating ?? performance?.averageRating)?.toFixed(1) ?? '—'}`} sub={`${performance?.totalRatingsCount ?? 0} ${t('reviews')}`} valueColor="var(--yellow)" />
        <MetricCard icon={Zap}         label={t('success_label')}  value={performance?.successRate != null ? `${performance.successRate}%` : '—'} sub={t('rate')} valueColor="var(--accent)" />
        <MetricCard icon={IndianRupee} label={t('earnings_label')} value={`₹${((performance?.totalEarnings ?? 0) / 1000).toFixed(1)}k`} sub={t('total')} valueColor="var(--green)" />
      </div>
    </div>
  );
});

const AvailableOrdersSection = memo(function AvailableOrdersSection({ orders, t }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 'var(--r-sm)', background: 'var(--blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={15} style={{ color: 'var(--blue)' }} />
          </div>
          <div className="section-header" style={{ marginBottom: 0 }}>{t('available_orders')}</div>
        </div>
  
        <span className="badge blue">{orders.length}</span>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-2)', fontSize: 13 }}>
          {t('no_orders_now')}
        </div>
      ) : (
        <div>
          {orders.slice(0, 3).map((order, i) => (
            <div key={order.orderId || order.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '11px 0',
              borderBottom: i < Math.min(orders.length, 3) - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)', fontWeight: 600 }}>
                  #{(order.orderId || order.id || '').slice(-8).toUpperCase()}
                </span>
                <div style={{ fontSize: 12, color: 'var(--text-1)', marginTop: 2, fontWeight: 500 }}>
                  {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                </div>
              </div>
              <span className="badge blue">NEW</span>
            </div>
          ))}
          {orders.length > 3 && (
            <div style={{ textAlign: 'center', paddingTop: 12, fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>
              +{orders.length - 3} {t('more_in_orders_tab')}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default function DashboardPage() {
  const { riderData, performance, loading, loadingStatus, tracking, currentStatus, isOnline, changeStatus, refresh } = useRiderStatus();
  const { placedOrders } = useOrders({ autoFetch: isOnline });
  const { isOnline: hasNetwork } = useNetworkStatus();
  const { t } = useLang();

  const STATUS_CONFIG = getStatusConfig(t);
  const statusCfg   = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.OFFLINE;
  const notApproved = riderData && riderData.onboardingStatus !== 'APPROVED';
  const isBlocked   = currentStatus === 'BLOCKED' || riderData?.status === 'BLOCKED';
  const userName    = riderData?.firstName || 'Rider';

  if (loading) return <div className="page-enter"><SkeletonDashboard /></div>;

  return (
    <div className="page-enter">
      {/* Network banner */}
      {!hasNetwork && (
        <div style={{
          padding: '10px 14px', marginBottom: 14, borderRadius: 'var(--r-md)',
          background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)',
          fontSize: 12, fontWeight: 600, color: 'var(--red)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {t('no_internet')}
        </div>
      )}

      {/* Blocked rider banner — persistent, above everything */}
      {isBlocked && (
        <div style={{
          padding: '14px 16px',
          marginBottom: 14,
          borderRadius: 'var(--r-md)',
          background: 'rgba(220,38,38,0.10)',
          border: '1.5px solid rgba(220,38,38,0.45)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🚫</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#ff4d6d', letterSpacing: '-0.02em' }}>
                Account Block Hai
              </div>
              <div style={{ fontSize: 12, color: '#000000', marginTop: 3, lineHeight: 1.5 }}>
                Aapka rider account block kar diya gaya hai. Aap abhi orders accept nahi kar sakte.
              </div>
            </div>
          </div>
          <div style={{
            fontSize: 11,
            color: '#ff8fa3',
            padding: '8px 12px',
            background: 'rgba(220,38,38,0.08)',
            borderRadius: 8,
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.55,
          }}>
            📞 Support se contact karein ya admin se baat karein apna account unblock karwane ke liye.
          </div>
        </div>
      )}

      {/* Greeting row */}
      <div className="flex items-center justify-between mb-16">
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, marginBottom: 3 }}>{t('welcome_back')}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-0)', letterSpacing: '-0.04em', lineHeight: 1 }}>
            {userName} 👋
          </div>
        </div>
        <button
          onClick={refresh}
          style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)', width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-1)',
          }}
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Onboarding banner */}
      {notApproved && (
        <div className="card mb-12" style={{ background: 'rgba(255,140,66,0.08)', borderColor: 'rgba(255,140,66,0.22)', marginBottom: 14 }}>
          <div className="flex items-center gap-12">
            <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: 'rgba(255,140,66,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bike size={18} style={{ color: 'var(--orange)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--orange)', fontSize: 14, letterSpacing: '-0.02em' }}>
                {t('onboarding_pending')}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 3, fontWeight: 500 }}>
                Status: <span style={{ color: 'var(--text-1)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {riderData?.onboardingStatus || 'NOT_SUBMITTED'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status card */}
      <div className="card mb-12">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-2)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              {t('availability')}
            </div>
            <span className={`status-pill ${statusCfg.color}`}>
              <span className={`status-dot ${statusCfg.dot}`} />
              {statusCfg.label}
            </span>
          </div>

          {!notApproved && !isBlocked && (
            <div className="flex gap-6">
              {currentStatus === 'OFFLINE' && (
                <button className="btn btn-primary btn-sm" onClick={() => changeStatus('online')} disabled={loadingStatus}>
                  <Wifi size={13} /> {t('go_online')}
                </button>
              )}
              {isOnline && (
                <>
                  <button className="btn btn-secondary btn-sm" onClick={() => changeStatus('break')} disabled={loadingStatus}>
                    <Coffee size={13} /> {t('take_break')}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => changeStatus('offline')} disabled={loadingStatus}>
                    <WifiOff size={13} />
                  </button>
                </>
              )}
              {currentStatus === 'ON_BREAK' && (
                <>
                  <button className="btn btn-primary btn-sm" onClick={() => changeStatus('resume')} disabled={loadingStatus}>
                    <Wifi size={13} /> {t('resume')}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => changeStatus('offline')} disabled={loadingStatus}>
                    <WifiOff size={13} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* GPS / status line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isOnline && (
            <>
              <div style={{ flex: 1, fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>
                {t('visible_to_customers')}
              </div>
              {tracking ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'var(--accent-dim)', border: '1px solid rgba(30,198,116,0.25)',
                  borderRadius: 99, padding: '3px 9px',
                  fontSize: 10, fontWeight: 700, color: 'var(--accent)',
                  letterSpacing: '0.04em',
                }}>
                  <Navigation size={9} style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                  {t('gps_on')}
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'var(--yellow-dim)', border: '1px solid rgba(255,209,102,0.2)',
                  borderRadius: 99, padding: '3px 9px',
                  fontSize: 10, fontWeight: 700, color: 'var(--yellow)',
                  letterSpacing: '0.04em',
                }}>
                  <Navigation size={9} style={{ animation: 'pulse 1s ease-in-out infinite' }} />
                  {t('locating')}
                </span>
              )}
            </>
          )}
          {currentStatus === 'OFFLINE' && (
            <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>
              {t('go_online_to_receive')}
            </span>
          )}
          {currentStatus === 'ON_BREAK' && (
            <span style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 600 }}>
              {t('on_break_paused')}
            </span>
          )}
        </div>
      </div>

      <PerformanceSection performance={performance} t={t} />
      {isOnline && !isBlocked && <AvailableOrdersSection orders={placedOrders} t={t} />}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}`}</style>
    </div>
  );
}