import React, { useState, useRef, useEffect } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';

/**
 * OTPModal — Full-screen OTP confirmation for pickup and delivery.
 * Blinkit-style: large digit boxes, clear CTA, bottom-sheet feel.
 */
export default function OTPModal({ type = 'delivery', onSubmit, onCancel, loading = false }) {
  // Delivery OTP = 4 digits, Pickup OTP = 4 digits (match server)
  const OTP_LENGTH = 4;
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const refs = useRef([]);

  const isPickup    = type === 'pickup';
  const accentColor = isPickup ? 'var(--accent)' : 'var(--blue)';
  const accentDim   = isPickup ? 'var(--accent-dim)' : 'var(--blue-dim)';
  const accentGlow  = isPickup ? 'var(--accent-glow)' : 'rgba(75,158,255,0.28)';
  const label       = isPickup ? 'Pickup Verification' : 'Delivery Verification';
  const desc        = isPickup
    ? 'Ask the sender for their pickup OTP'
    : 'Ask the customer for their delivery OTP';

  useEffect(() => {
    setTimeout(() => refs.current[0]?.focus(), 120);
  }, []);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...digits];
    next[i] = val.slice(-1);
    setDigits(next);
    if (val && i < OTP_LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'Enter' && digits.every(d => d)) handleSubmit();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (text.length === OTP_LENGTH) {
      setDigits(text.split(''));
      refs.current[OTP_LENGTH - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otp = digits.join('');
    if (otp.length === OTP_LENGTH) onSubmit(otp);
  };

  const filled = digits.filter(Boolean).length;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(5,7,12,0.88)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.18s ease',
    }}>
      <div style={{
        width: '100%', maxWidth: 480,
        background: 'var(--bg-1)',
        borderRadius: '24px 24px 0 0',
        padding: '12px 24px 36px',
        animation: 'sheetUp 0.25s cubic-bezier(0.32, 0, 0.15, 1)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
      }}>
        {/* Drag handle */}
        <div style={{
          width: 40, height: 4, borderRadius: 99,
          background: 'var(--bg-4)',
          margin: '0 auto 20px',
        }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{
              fontSize: 20, fontWeight: 800, color: 'var(--text-0)',
              letterSpacing: '-0.03em', marginBottom: 5,
            }}>
              {label}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>
              {desc}
            </div>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: 'var(--bg-3)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-sm)', width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-1)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, marginTop: 4 }}>
          {Array.from({ length: OTP_LENGTH }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 99,
              background: i < filled ? accentColor : 'var(--bg-3)',
              transition: 'background 0.2s ease',
            }} />
          ))}
        </div>

        {/* OTP inputs */}
        <div
          style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}
          onPaste={handlePaste}
        >
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => refs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              style={{
                width: 48, height: 60,
                textAlign: 'center',
                fontSize: 26, fontWeight: 800,
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.02em',
                background: d ? accentDim : 'var(--bg-2)',
                border: `2px solid ${d ? accentColor : 'var(--border)'}`,
                borderRadius: 'var(--r-md)',
                color: d ? accentColor : 'var(--text-0)',
                outline: 'none',
                transition: 'all 0.15s ease',
                caretColor: accentColor,
                boxShadow: d ? `0 0 0 3px ${accentDim}` : 'none',
              }}
            />
          ))}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading || filled < OTP_LENGTH}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 'var(--r-md)',
            border: 'none', cursor: filled === OTP_LENGTH ? 'pointer' : 'not-allowed',
            fontSize: 15, fontWeight: 800, fontFamily: 'var(--font-sans)',
            letterSpacing: '-0.01em',
            background: filled === OTP_LENGTH ? accentColor : 'var(--bg-3)',
            color: filled === OTP_LENGTH ? '#fff' : 'var(--text-2)',
            transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: filled === OTP_LENGTH ? `0 4px 16px ${accentGlow}` : 'none',
          }}
        >
          {loading ? (
            <><Loader2 size={17} style={{ animation: 'spin 0.8s linear infinite' }} /> Verifying…</>
          ) : (
            <><CheckCircle size={17} /> Confirm OTP</>
          )}
        </button>
      </div>
    </div>
  );
}