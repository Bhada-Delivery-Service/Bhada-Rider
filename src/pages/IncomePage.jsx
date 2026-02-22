import React, { useState, useEffect, useCallback } from 'react';
import {
  IndianRupee, ArrowDownToLine, Clock,
  CheckCircle2, XCircle, RefreshCw, ChevronDown, ChevronUp,
  Banknote, Smartphone, Wallet,
  AlertCircle, X, ArrowRight, Receipt,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { earningsAPI, ridersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// ─── Constants ────────────────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  { value: 'PAYTM', label: 'Paytm',        icon: Smartphone, hint: 'Enter your Paytm-linked mobile number' },
  { value: 'UPI',   label: 'UPI',           icon: ArrowRight, hint: 'e.g. yourname@upi or 9876543210@okaxis' },
  { value: 'BANK',  label: 'Bank Transfer', icon: Banknote,   hint: 'Account number · IFSC · Bank name' },
  { value: 'CASH',  label: 'Cash',          icon: Wallet,     hint: 'Admin will hand over cash directly' },
];

const WD_STATUS_CFG = {
  PENDING:  { label: 'Pending',  color: 'var(--blue)',  bg: 'var(--blue-dim)',  icon: Clock,        border: 'rgba(77,159,255,0.2)'  },
  APPROVED: { label: 'Approved', color: 'var(--green)', bg: 'var(--green-dim)', icon: CheckCircle2, border: 'rgba(54,211,153,0.2)'  },
  PAID:     { label: 'Paid',     color: 'var(--green)', bg: 'var(--green-dim)', icon: CheckCircle2, border: 'rgba(54,211,153,0.2)'  },
  REJECTED: { label: 'Rejected', color: 'var(--red)',   bg: 'var(--red-dim)',   icon: XCircle,      border: 'rgba(255,77,109,0.2)'  },
};

const fmt = (n) =>
  (n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';
const fmtTime = (d) =>
  d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: 'var(--bg-2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)', padding: '14px',
    }}>
      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: color || 'var(--text-0)', lineHeight: 1.1 }}>
        ₹{fmt(value)}
      </div>
    </div>
  );
}

// ─── Withdraw Modal ───────────────────────────────────────────────────────────

function WithdrawModal({ pendingPayout, riderId, riderData, onClose, onSuccess }) {
  // Pre-fill from saved bank account
  const savedUpi = riderData?.upiId;
  const savedBank = riderData?.bankAccountNumber;
  const defaultMethod = savedUpi ? 'UPI' : savedBank ? 'BANK' : 'PAYTM';
  const defaultDetails = savedUpi
    ? savedUpi
    : savedBank
      ? `A/C: ${savedBank}\nIFSC: ${riderData?.bankIfscCode || ''}\nBank: ${riderData?.bankName || ''}`.trim()
      : '';

  const [method, setMethod]   = useState(defaultMethod);
  const [amount, setAmount]   = useState('');
  const [details, setDetails] = useState(defaultDetails);
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);

  const selected = PAYMENT_METHODS.find(m => m.value === method);
  const amtNum   = parseFloat(amount) || 0;
  const amtValid = amtNum >= 1 && amtNum <= pendingPayout;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await earningsAPI.initiateWithdrawal(riderId, {
        requestedAmount: amtNum,
        paymentMethod:   method,
        accountDetails:  details.trim(),
      });
      toast.success('Withdrawal request submitted! Admin will process it shortly.');
      onSuccess();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">

        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-title">Request Withdrawal</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 3 }}>
              Available:&nbsp;
              <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                ₹{fmt(pendingPayout)}
              </span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        {/* Step bar */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {['Method', 'Details', 'Confirm'].map((s, i) => (
            <div key={s} style={{ flex: 1 }}>
              <div style={{
                height: 3, borderRadius: 99, marginBottom: 4,
                background: step >= i + 1 ? 'var(--accent)' : 'var(--border)',
                opacity: step === i + 1 ? 1 : step > i + 1 ? 0.55 : 0.25,
                transition: 'all 0.2s',
              }} />
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', color: step >= i + 1 ? 'var(--accent)' : 'var(--text-2)' }}>
                {s}
              </div>
            </div>
          ))}
        </div>

        {/* ── Step 1: payment method ── */}
        {step === 1 && (
          <>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 14 }}>
              How would you like to receive your payment?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => {
                const active = method === value;
                return (
                  <button
                    key={value}
                    onClick={() => setMethod(value)}
                    style={{
                      background: active ? 'var(--accent-dim)' : 'var(--bg-2)',
                      border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 10, padding: '13px 16px',
                      display: 'flex', alignItems: 'center', gap: 12,
                      cursor: 'pointer', color: active ? 'var(--accent)' : 'var(--text-0)',
                      transition: 'all 0.15s', width: '100%', textAlign: 'left',
                    }}
                  >
                    <Icon size={18} style={{ flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span>
                    {active && <CheckCircle2 size={15} style={{ marginLeft: 'auto' }} />}
                  </button>
                );
              })}
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStep(2)}>
              Continue <ArrowRight size={15} />
            </button>
          </>
        )}

        {/* ── Step 2: amount + account details ── */}
        {step === 2 && (
          <>
            <div style={{ marginBottom: 18 }}>
              <div className="form-label">Amount to Withdraw (₹)</div>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type="number" min="1" max={pendingPayout}
                  placeholder={`1 – ${fmt(pendingPayout)}`}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{ paddingRight: 76 }}
                />
                <button
                  onClick={() => setAmount(String(pendingPayout))}
                  style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    background: 'var(--bg-3)', border: '1px solid var(--border)',
                    borderRadius: 6, fontSize: 11, color: 'var(--accent)',
                    padding: '3px 8px', cursor: 'pointer', fontFamily: 'var(--font-mono)',
                  }}
                >MAX</button>
              </div>
              {amtNum > pendingPayout && (
                <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertCircle size={11} /> Exceeds available balance of ₹{fmt(pendingPayout)}
                </div>
              )}
            </div>

            <div className="form-group">
              <div className="form-label">{selected?.label} Details</div>
              <textarea
                className="form-textarea"
                placeholder={selected?.hint}
                value={details}
                onChange={e => setDetails(e.target.value)}
                style={{ minHeight: 72 }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
              <button
                className="btn btn-primary" style={{ flex: 2 }}
                disabled={!amtValid || details.trim().length < 3}
                onClick={() => setStep(3)}
              >
                Review <ArrowRight size={15} />
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: confirm ── */}
        {step === 3 && (
          <>
            {/* Summary box */}
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 18 }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                Request Summary
              </div>
              {[
                ['Amount',  `₹${fmt(amtNum)}`],
                ['Method',  selected?.label],
                ['Details', details],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-2)', minWidth: 68 }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)', textAlign: 'right', maxWidth: '62%', wordBreak: 'break-word' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Info note */}
            <div style={{ background: 'var(--blue-dim)', border: '1px solid rgba(77,159,255,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--text-1)', marginBottom: 18, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <AlertCircle size={13} style={{ color: 'var(--blue)', flexShrink: 0, marginTop: 1 }} />
              Your balance will be held until admin confirms the payment. Rejected requests are fully refunded.
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)} disabled={loading}>Back</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting…' : 'Confirm Request'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Earning transaction row ──────────────────────────────────────────────────

function EarningRow({ earning }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, background: 'var(--green-dim)',
          border: '1px solid rgba(54,211,153,0.2)',
          borderRadius: 10, display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <Receipt size={15} style={{ color: 'var(--green)' }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)' }}>
            {earning.description || 'Delivery earning'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            {fmtDate(earning.createdAt)} · {fmtTime(earning.createdAt)}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-2)', marginTop: 2 }}>
            ₹{fmt(earning.grossAmount)} − {earning.commissionPercentage}% commission
          </div>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, color: 'var(--green)', flexShrink: 0, marginLeft: 8 }}>
        +₹{fmt(earning.netAmount)}
      </div>
    </div>
  );
}

// ─── Withdrawal row (collapsible) ─────────────────────────────────────────────

function WithdrawalRow({ wd }) {
  const [expanded, setExpanded] = useState(false);
  const cfg       = WD_STATUS_CFG[wd.status] || WD_STATUS_CFG.PENDING;
  const StatusIcon = cfg.icon;
  const methodCfg = PAYMENT_METHODS.find(m => m.value === wd.paymentMethod);
  const MethodIcon = methodCfg?.icon || Wallet;

  const detailRows = [
    ['Account', wd.accountDetails],
    wd.paidAmount          ? ['Paid',    `₹${fmt(wd.paidAmount)}`]              : null,
    wd.paidAt              ? ['Paid on', `${fmtDate(wd.paidAt)} ${fmtTime(wd.paidAt)}`] : null,
    wd.transactionReference ? ['Ref #',  wd.transactionReference]               : null,
    wd.paymentNotes        ? ['Notes',   wd.paymentNotes]                       : null,
    wd.rejectionReason     ? ['Reason',  wd.rejectionReason]                    : null,
  ].filter(Boolean);

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      {/* Row header — tap to expand */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: '12px 0', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        }}
      >
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderRadius: 10, display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <MethodIcon size={15} style={{ color: cfg.color }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)' }}>
              {methodCfg?.label || wd.paymentMethod}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
              {fmtDate(wd.createdAt)}
            </div>
          </div>
        </div>
        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, color: cfg.color }}>
              ₹{fmt(wd.requestedAmount)}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 99,
              background: cfg.bg, border: `1px solid ${cfg.border}`, marginTop: 3,
            }}>
              <StatusIcon size={9} style={{ color: cfg.color }} />
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, color: cfg.color }}>
                {cfg.label}
              </span>
            </div>
          </div>
          {expanded
            ? <ChevronUp  size={14} style={{ color: 'var(--text-2)' }} />
            : <ChevronDown size={14} style={{ color: 'var(--text-2)' }} />
          }
        </div>
      </button>

      {/* Expanded detail panel */}
      {expanded && (
        <div style={{
          background: 'var(--bg-2)', borderRadius: 8,
          padding: '12px 14px', marginBottom: 12,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {detailRows.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0, minWidth: 64 }}>
                {k}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-0)', textAlign: 'right', wordBreak: 'break-word' }}>
                {v}
              </span>
            </div>
          ))}
          {wd.paymentScreenshotUrl && (
            <a
              href={wd.paymentScreenshotUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 11, color: 'var(--accent)',
                fontFamily: 'var(--font-mono)', textDecoration: 'none',
                background: 'var(--accent-dim)', borderRadius: 6,
                padding: '4px 10px', border: '1px solid var(--accent-glow)',
                marginTop: 2, alignSelf: 'flex-start',
              }}
            >
              <Receipt size={10} /> View Payment Screenshot
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function IncomePage() {
  const { user }                      = useAuth();
  const [summary, setSummary]         = useState(null);
  const [earnings, setEarnings]       = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [riderData, setRiderData]     = useState(null);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [tab, setTab]                 = useState('earnings'); // 'earnings' | 'withdrawals'

  const load = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const [sumRes, earnRes, wdRes, riderRes] = await Promise.allSettled([
        earningsAPI.getSummary(user.uid),
        earningsAPI.getEarnings(user.uid, 50),
        earningsAPI.getWithdrawals(user.uid),
        ridersAPI.getById(user.uid),
      ]);
      if (sumRes.status === 'fulfilled')   setSummary(sumRes.value.data?.data ?? null);
      if (earnRes.status === 'fulfilled')  setEarnings(earnRes.value.data?.data ?? []);
      if (wdRes.status === 'fulfilled')    setWithdrawals(wdRes.value.data?.data ?? []);
      if (riderRes.status === 'fulfilled') setRiderData(riderRes.value.data?.data || riderRes.value.data);
    } catch {
      toast.error('Failed to load earnings');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => { load(); }, [load]);

  const pendingPayout  = summary?.pendingPayout      ?? 0;
  const totalEarnings  = summary?.totalEarnings      ?? 0;
  const totalWithdrawn = summary?.totalWithdrawn     ?? 0;
  const thisMonth      = summary?.thisMonthEarnings  ?? 0;
  const lastMonth      = summary?.lastMonthEarnings  ?? 0;
  const hasPendingWd   = withdrawals.some(w => w.status === 'PENDING');

  if (loading) {
    return <div className="loading-center" style={{ minHeight: 340 }}><div className="loader" /></div>;
  }

  return (
    <div>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
            My Earnings
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>
            Track your income and payouts
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={load} style={{ padding: 8 }} aria-label="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* ── Available balance hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,229,160,0.12) 0%, rgba(0,229,160,0.04) 100%)',
        border: '1.5px solid rgba(0,229,160,0.25)',
        borderRadius: 16, padding: '20px 20px 18px', marginBottom: 12,
      }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'rgba(0,229,160,0.7)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Available to Withdraw
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '6px 0 16px' }}>
          ₹{fmt(pendingPayout)}
        </div>

        {pendingPayout >= 1 ? (
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={hasPendingWd}
            onClick={() => setShowModal(true)}
          >
            <ArrowDownToLine size={16} />
            {hasPendingWd ? 'Withdrawal Pending…' : 'Request Withdrawal'}
          </button>
        ) : (
          <div style={{ fontSize: 12, color: 'rgba(0,229,160,0.5)', fontFamily: 'var(--font-mono)', textAlign: 'center', padding: '6px 0' }}>
            Complete deliveries to start earning
          </div>
        )}

        {hasPendingWd && (
          <div style={{ fontSize: 11, color: 'var(--blue)', marginTop: 10, display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
            <Clock size={10} /> A withdrawal is pending admin review
          </div>
        )}
      </div>

      {/* ── No payout account warning ── */}
      {!riderData?.bankAccountNumber && !riderData?.upiId && (
        <div style={{
          padding: '12px 14px', marginBottom: 14,
          background: 'var(--orange-dim)', border: '1px solid rgba(255,154,60,0.2)',
          borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <AlertCircle size={15} style={{ color: 'var(--orange)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--orange)', marginBottom: 2 }}>
              No payout account saved
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-1)' }}>
              Add your bank account or UPI ID in Profile → Payout Account so withdrawals are pre-filled automatically.
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        <StatCard label="Total Earned"    value={totalEarnings}  color="var(--text-0)"  />
        <StatCard label="Total Withdrawn" value={totalWithdrawn} color="var(--text-1)"  />
        <StatCard label="This Month"      value={thisMonth}      color="var(--blue)"    />
        <StatCard label="Last Month"      value={lastMonth}      color="var(--text-2)"  />
      </div>

      {/* ── Tab bar ── */}
      <div style={{
        display: 'flex', background: 'var(--bg-2)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
        padding: 4, marginBottom: 14,
      }}>
        {[
          { key: 'earnings',    label: 'Transactions', count: earnings.length    },
          { key: 'withdrawals', label: 'Withdrawals',  count: withdrawals.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              background: tab === t.key ? 'var(--bg-1)' : 'transparent',
              border: `1px solid ${tab === t.key ? 'var(--border-bright)' : 'transparent'}`,
              borderRadius: 6, padding: '9px 0',
              color: tab === t.key ? 'var(--text-0)' : 'var(--text-2)',
              fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {t.label}
            {t.count > 0 && (
              <span style={{
                background: tab === t.key ? 'var(--accent-dim)' : 'var(--bg-3)',
                color: tab === t.key ? 'var(--accent)' : 'var(--text-2)',
                borderRadius: 99, fontSize: 10, fontFamily: 'var(--font-mono)',
                fontWeight: 700, padding: '1px 6px',
              }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Transactions list ── */}
      {tab === 'earnings' && (
        <div className="card">
          {earnings.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-state-icon"><IndianRupee size={22} /></div>
              <h3>No transactions yet</h3>
              <p>Complete deliveries to start earning</p>
            </div>
          ) : (
            <>
              {earnings.map((e, i) => <EarningRow key={e.id || i} earning={e} />)}
              <div style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', textAlign: 'center', paddingTop: 12, borderTop: '1px solid var(--border)', marginTop: 4 }}>
                Showing last {earnings.length} transaction{earnings.length !== 1 ? 's' : ''}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Withdrawals list ── */}
      {tab === 'withdrawals' && (
        <div className="card">
          {withdrawals.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-state-icon"><ArrowDownToLine size={22} /></div>
              <h3>No withdrawals yet</h3>
              <p>Request your first payout above</p>
            </div>
          ) : (
            withdrawals.map((wd, i) => <WithdrawalRow key={wd.id || i} wd={wd} />)
          )}
        </div>
      )}

      {/* ── Withdrawal modal ── */}
      {showModal && (
        <WithdrawModal
          pendingPayout={pendingPayout}
          riderId={user.uid}
          riderData={riderData}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); load(); }}
        />
      )}
    </div>
  );
}