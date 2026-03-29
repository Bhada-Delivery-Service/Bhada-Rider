// MilestoneRewardBanner.jsx
// Drop this component into your DashboardPage.jsx
// Usage: <MilestoneRewardBanner deliveries={performance?.totalDeliveries ?? 0} t={t} />

import React, { memo, useState } from 'react';
import { Gift, ChevronRight, X } from 'lucide-react';

// ─── Milestone config ────────────────────────────────────────────────────────
const MILESTONES = [
  { at: 10,  icon: '🎉', labelKey: 'milestone_10',  rewardKey: 'reward_10',  color: '#6366f1', dimColor: 'rgba(99,102,241,0.12)'  },
  { at: 25,  icon: '🧢', labelKey: 'milestone_25',  rewardKey: 'reward_25',  color: '#f59e0b', dimColor: 'rgba(245,158,11,0.12)'  },
  { at: 50,  icon: '👕', labelKey: 'milestone_50',  rewardKey: 'reward_50',  color: '#10b981', dimColor: 'rgba(16,185,129,0.12)'  },
  { at: 100, icon: '💰', labelKey: 'milestone_100', rewardKey: 'reward_100', color: '#f43f5e', dimColor: 'rgba(244,63,94,0.12)'   },
  { at: 250, icon: '🏆', labelKey: 'milestone_250', rewardKey: 'reward_250', color: '#8b5cf6', dimColor: 'rgba(139,92,246,0.12)'  },
];

// Fallback strings if your t() doesn't have these keys yet
const FALLBACK = {
  milestone_10:  'Welcome Badge',
  reward_10:     'In-app badge unlock',
  milestone_25:  'Cap Reward',
  reward_25:     'Bhada cap ya chhota reward',
  milestone_50:  'Bhada T-Shirt 🔥',
  reward_50:     'Official Bhada rider T-shirt earn karo',
  milestone_100: 'Bonus Cash',
  reward_100:    'Wallet credit ya cash bonus',
  milestone_250: 'Premium Reward',
  reward_250:    'Exclusive premium rider rewards',
  deliveries_done: 'deliveries ho gayi',
  deliveries_left: 'aur deliveries baaki',
  next_reward:   'Next Reward',
  all_unlocked:  'Saare rewards unlock! 🎊',
  view_all:      'Sab dekho',
};

function txt(t, key) {
  try { const v = t(key); return v !== key ? v : FALLBACK[key] || key; }
  catch { return FALLBACK[key] || key; }
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ from, to, current }) {
  const pct = Math.min(100, Math.max(0, ((current - from) / (to - from)) * 100));
  return (
    <div style={{ height: 5, borderRadius: 99, background: 'var(--bg-2, rgba(255,255,255,0.08))', overflow: 'hidden', margin: '8px 0 4px' }}>
      <div style={{
        height: '100%', borderRadius: 99,
        width: `${pct}%`,
        background: 'linear-gradient(90deg, var(--accent,#1ec674), #00e0a0)',
        transition: 'width 0.7s cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </div>
  );
}

// ─── Single milestone chip ────────────────────────────────────────────────────
function MilestoneChip({ milestone, done, active, deliveries, t }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px',
      borderRadius: 'var(--r-sm, 10px)',
      background: active ? milestone.dimColor : done ? 'var(--bg-2, rgba(255,255,255,0.04))' : 'transparent',
      border: active
        ? `1.5px solid ${milestone.color}44`
        : done
          ? '1px solid var(--border, rgba(255,255,255,0.08))'
          : '1px solid transparent',
      opacity: !done && !active ? 0.5 : 1,
      transition: 'all 0.2s',
      position: 'relative',
    }}>
      {/* Icon */}
      <div style={{
        width: 34, height: 34, borderRadius: 'var(--r-sm, 10px)',
        background: done || active ? milestone.dimColor : 'var(--bg-2, rgba(255,255,255,0.06))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17, flexShrink: 0,
        border: active ? `1px solid ${milestone.color}55` : '1px solid transparent',
      }}>
        {done ? '✅' : milestone.icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: done ? 'var(--text-2)' : active ? milestone.color : 'var(--text-1)' }}>
            {milestone.at} deliveries
          </span>
          {done && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent,#1ec674)', background: 'var(--accent-dim)', borderRadius: 99, padding: '1px 7px' }}>DONE</span>}
          {active && <span style={{ fontSize: 10, fontWeight: 700, color: milestone.color, background: milestone.dimColor, borderRadius: 99, padding: '1px 7px', border: `1px solid ${milestone.color}33` }}>NEXT</span>}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {txt(t, milestone.rewardKey)}
        </div>

        {/* Progress under the active milestone */}
        {active && (() => {
          const prevAt = MILESTONES[MILESTONES.indexOf(milestone) - 1]?.at ?? 0;
          const left = milestone.at - deliveries;
          return (
            <>
              <ProgressBar from={prevAt} to={milestone.at} current={deliveries} />
              <div style={{ fontSize: 10, color: 'var(--text-2)', fontWeight: 600 }}>
                {deliveries}/{milestone.at} · {left} {txt(t, 'deliveries_left')}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}

// ─── Main banner ──────────────────────────────────────────────────────────────
export const MilestoneRewardBanner = memo(function MilestoneRewardBanner({ deliveries = 0, t = k => k }) {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const nextMilestone = MILESTONES.find(m => m.at > deliveries);
  const allDone       = !nextMilestone;

  // In collapsed mode, show just the teaser
  const prevAt = nextMilestone ? (MILESTONES[MILESTONES.indexOf(nextMilestone) - 1]?.at ?? 0) : null;

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        borderRadius: 'var(--r-md, 14px)',
        border: '1px solid var(--border, rgba(255,255,255,0.1))',
        background: 'var(--bg-1, #111)',
        overflow: 'hidden',
      }}>

        {/* ── Header / Teaser row ── */}
        <div
          onClick={() => setExpanded(e => !e)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 14px',
            cursor: 'pointer',
            background: expanded ? 'var(--bg-2, rgba(255,255,255,0.03))' : 'transparent',
          }}
        >
          {/* Gift icon */}
          <div style={{
            width: 34, height: 34, borderRadius: 'var(--r-sm, 10px)',
            background: 'rgba(16,185,129,0.13)',
            border: '1px solid rgba(16,185,129,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Gift size={16} style={{ color: 'var(--accent, #1ec674)' }} />
          </div>

          {/* Text */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-0)', letterSpacing: '-0.02em' }}>
              {allDone ? txt(t, 'all_unlocked') : `${txt(t, 'next_reward')}: ${nextMilestone.icon} ${nextMilestone.at} deliveries`}
            </div>
            {!allDone && (
              <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2, fontWeight: 500 }}>
                {deliveries} / {nextMilestone.at} · {nextMilestone.at - deliveries} {txt(t, 'deliveries_left')}
              </div>
            )}
            {/* Thin progress bar in collapsed state */}
            {!allDone && !expanded && (
              <div style={{ height: 3, borderRadius: 99, background: 'var(--bg-2, rgba(255,255,255,0.08))', marginTop: 6, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  width: `${Math.min(100, ((deliveries - prevAt) / (nextMilestone.at - prevAt)) * 100)}%`,
                  background: 'linear-gradient(90deg, var(--accent,#1ec674), #00e0a0)',
                }} />
              </div>
            )}
          </div>

          {/* Right: expand chevron + dismiss */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronRight
              size={16}
              style={{
                color: 'var(--text-2)',
                transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.22s',
              }}
            />
            <button
              onClick={e => { e.stopPropagation(); setDismissed(true); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-2)', padding: 4, borderRadius: 6,
                display: 'flex', alignItems: 'center',
              }}
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* ── Expanded milestones list ── */}
        {expanded && (
          <div style={{ padding: '0 10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 1, background: 'var(--border, rgba(255,255,255,0.08))', margin: '0 4px 8px' }} />
            {MILESTONES.map(m => (
              <MilestoneChip
                key={m.at}
                milestone={m}
                done={deliveries >= m.at}
                active={m === nextMilestone}
                deliveries={deliveries}
                t={t}
              />
            ))}

            {/* T-shirt highlight callout */}
            {nextMilestone && nextMilestone.at <= 50 && (
              <div style={{
                marginTop: 6,
                padding: '10px 12px',
                borderRadius: 'var(--r-sm, 10px)',
                background: 'rgba(16,185,129,0.07)',
                border: '1px dashed rgba(16,185,129,0.3)',
                fontSize: 11, lineHeight: 1.6, color: 'var(--text-2)',
              }}>
                💡 <strong style={{ color: 'var(--accent, #1ec674)' }}>50 deliveries</strong> pe Bhada ka official rider T-shirt milega — brand pehnke deliver karo, pride aur identity dono milegi!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});