import React from 'react';

/* Base shimmer block */
export function Skeleton({ height = 16, width = '100%', borderRadius, style = {} }) {
  return (
    <span className="skeleton" style={{
      height, width: typeof width === 'number' ? `${width}px` : width,
      borderRadius: borderRadius || 'var(--r-sm)',
      ...style,
    }} />
  );
}

/* Generic card placeholder */
export function SkeletonCard({ rows = 3 }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <Skeleton width={46} height={46} borderRadius="var(--r-md)" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton height={13} width="55%" />
          <Skeleton height={11} width="35%" />
        </div>
      </div>
      {rows > 1 && Array.from({ length: rows - 1 }).map((_, i) => (
        <Skeleton key={i} height={13} width={`${65 - i * 15}%`} />
      ))}
    </div>
  );
}

/* Order card skeleton — matches OrderCard layout */
export function SkeletonOrderCard() {
  return (
    <div style={{
      background: 'var(--bg-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      padding: '16px',
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {/* Icon box */}
        <Skeleton width={46} height={46} borderRadius="var(--r-md)" />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* ID + badge row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton height={11} width={90} />
            <Skeleton height={20} width={70} borderRadius={99} />
          </div>
          {/* Route block */}
          <div style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)', padding: '9px 11px',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <Skeleton height={12} width="70%" />
            <Skeleton height={12} width="55%" />
          </div>
          {/* Meta chips */}
          <div style={{ display: 'flex', gap: 6 }}>
            <Skeleton height={20} width={44} borderRadius={99} />
            <Skeleton height={20} width={40} borderRadius={99} />
            <Skeleton height={20} width={32} borderRadius={99} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* 4-metric row skeleton */
export function SkeletonMetricRow() {
  return (
    <div className="metric-row-4">
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="metric-card">
          <Skeleton height={10} width="60%" style={{ marginBottom: 8 }} />
          <Skeleton height={24} width="70%" style={{ marginBottom: 6 }} />
          <Skeleton height={10} width="45%" />
        </div>
      ))}
    </div>
  );
}

/* Full dashboard skeleton */
export function SkeletonDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton height={13} width={70} />
          <Skeleton height={24} width={130} borderRadius="var(--r-sm)" />
        </div>
        <Skeleton width={36} height={36} borderRadius="var(--r-sm)" />
      </div>

      {/* Status card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton height={10} width={80} />
            <Skeleton height={28} width={110} borderRadius={99} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Skeleton height={32} width={90} borderRadius="var(--r-sm)" />
          </div>
        </div>
        <Skeleton height={14} width="65%" />
      </div>

      {/* Metrics */}
      <div className="card">
        <Skeleton height={16} width={110} style={{ marginBottom: 14 }} />
        <SkeletonMetricRow />
      </div>

      {/* Orders */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <Skeleton height={16} width={130} />
          <Skeleton height={20} width={28} borderRadius={99} />
        </div>
        {[0, 1].map(i => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 1 ? '1px solid var(--border)' : 'none' }}>
            <Skeleton height={12} width={80} />
            <Skeleton height={20} width={55} borderRadius={99} />
          </div>
        ))}
      </div>
    </div>
  );
}
