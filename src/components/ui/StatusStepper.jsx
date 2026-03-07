import React from 'react';
import { Package, Truck, CheckCircle, XCircle, Zap, Clock } from 'lucide-react';

const STEPS = [
  { key: 'PLACED',     label: 'Placed',     shortLabel: 'Order',    Icon: Package,     color: '#4B9EFF' },
  { key: 'READY',      label: 'Ready',      shortLabel: 'Ready',    Icon: Zap,         color: '#1EC674' },
  { key: 'DISPATCHED', label: 'On the way', shortLabel: 'Transit',  Icon: Truck,       color: '#FF8C42' },
  { key: 'DELIVERED',  label: 'Delivered',  shortLabel: 'Done',     Icon: CheckCircle, color: '#2ECC71' },
];

const STATUS_ORDER = ['PLACED', 'READY', 'DISPATCHED', 'DELIVERED'];

export default function StatusStepper({ status }) {
  if (status === 'CANCELLED') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        background: 'rgba(255,71,87,0.1)',
        border: '1px solid rgba(255,71,87,0.22)',
        borderRadius: 'var(--r-lg)', marginBottom: 16,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 'var(--r-md)',
          background: 'rgba(255,71,87,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <XCircle size={20} style={{ color: 'var(--red)' }} />
        </div>
        <div>
          <div style={{ fontWeight: 800, color: 'var(--red)', fontSize: 14, letterSpacing: '-0.02em' }}>
            Order Cancelled
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>
            This delivery has been cancelled
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <div style={{
      background: 'var(--bg-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      padding: '16px',
      marginBottom: 16,
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: 'var(--text-2)',
          letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>
          Order Progress
        </div>
        {currentIndex >= 0 && (
          <div style={{
            fontSize: 11, fontWeight: 700,
            color: STEPS[currentIndex]?.color,
            background: `${STEPS[currentIndex]?.color}18`,
            padding: '3px 10px', borderRadius: 99,
          }}>
            {STEPS[currentIndex]?.label}
          </div>
        )}
      </div>

      {/* Steps row */}
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        {STEPS.map((step, i) => {
          const isDone    = currentIndex > i;
          const isActive  = currentIndex === i;
          const isPending = currentIndex < i;
          const { Icon }  = step;

          return (
            <React.Fragment key={step.key}>
              {/* Step node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: isPending ? 'var(--bg-3)' : `${step.color}18`,
                  border: `2px solid ${isPending ? 'var(--border)' : step.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  ...(isActive ? {
                    boxShadow: `0 0 0 5px ${step.color}18`,
                    animation: 'stepPulse 2.2s ease-in-out infinite',
                  } : {}),
                }}>
                  {isDone ? (
                    <CheckCircle size={16} style={{ color: step.color }} />
                  ) : (
                    <Icon size={15} style={{ color: isPending ? 'var(--text-2)' : step.color }} />
                  )}
                </div>
                <div style={{
                  fontSize: 9.5, fontWeight: 700, marginTop: 6,
                  color: isPending ? 'var(--text-2)' : step.color,
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                }}>
                  {step.shortLabel}
                </div>
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, marginBottom: 20,
                  background: currentIndex > i
                    ? `linear-gradient(90deg, ${step.color}, ${STEPS[i + 1].color})`
                    : 'var(--bg-3)',
                  transition: 'background 0.4s ease',
                  borderRadius: 99,
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
