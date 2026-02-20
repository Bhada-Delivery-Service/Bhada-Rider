import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Shield, ArrowLeft, RefreshCw, Bike } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { sendOTP, verifyOTP } from '../services/firebase';

const STEP = { PHONE: 'phone', OTP: 'otp' };

export default function LoginPage() {
  const [step, setStep] = useState(STEP.PHONE);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const formatPhone = (raw) => {
    const cleaned = raw.replace(/\D/g, '');
    if (raw.startsWith('+')) return raw.replace(/\s/g, '');
    if (cleaned.length === 10) return `+91${cleaned}`;
    return `+${cleaned}`;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const formatted = formatPhone(phone);
    if (formatted.length < 10) { toast.error('Enter a valid phone number'); return; }
    setLoading(true);
    try {
      const result = await sendOTP(formatted);
      setConfirmationResult(result);
      setStep(STEP.OTP);
      setResendTimer(30);
      toast.success(`OTP sent to ${formatted}`);
    } catch (err) {
      const msg = err.code === 'auth/invalid-phone-number' ? 'Invalid phone number'
        : err.code === 'auth/too-many-requests' ? 'Too many attempts. Try later.'
        : err.message || 'Failed to send OTP';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length !== 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const idToken = await verifyOTP(confirmationResult, otpStr);
      const { data } = await authAPI.verifyFirebase(idToken);
      await login(data.accessToken, data.refreshToken, data.user);
      toast.success('Welcome back, Rider!');
      navigate('/');
    } catch (err) {
      const msg = err.code === 'auth/invalid-verification-code' ? 'Incorrect OTP'
        : err.code === 'auth/code-expired' ? 'OTP expired. Resend it.'
        : err.response?.data?.message || 'Verification failed';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); otpRefs.current[5]?.focus(); }
  };

  const handleResend = async () => {
    setOtp(['', '', '', '', '', '']);
    setLoading(true);
    try {
      const result = await sendOTP(formatPhone(phone));
      setConfirmationResult(result);
      setResendTimer(30);
      toast.success('OTP resent!');
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch { toast.error('Failed to resend'); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
      }} />

      <div className="login-card" style={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div className="flex items-center gap-12 mb-20">
          <div style={{
            width: 50, height: 50,
            background: 'var(--accent)',
            borderRadius: 14,
            display: 'grid', placeItems: 'center',
            color: 'var(--bg-0)',
          }}>
            <Bike size={26} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-0)', letterSpacing: '-0.03em' }}>Bhada</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-2)', letterSpacing: '0.1em' }}>RIDER APP</div>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              height: 3, flex: 1, borderRadius: 99,
              background: (step === STEP.OTP ? i <= 1 : i === 0) ? 'var(--accent)' : 'var(--bg-3)',
              transition: 'background 0.3s ease',
              boxShadow: (step === STEP.OTP ? i <= 1 : i === 0) ? '0 0 8px var(--accent-glow)' : 'none',
            }} />
          ))}
        </div>

        {/* STEP 1: Phone */}
        {step === STEP.PHONE && (
          <div style={{ animation: 'slideUp 0.22s ease' }}>
            <div id="recaptcha-container" />
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 6 }}>Sign In</h1>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 28 }}>Enter your phone number to receive an OTP</p>
            <form onSubmit={handleSendOTP}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-2)', pointerEvents: 'none' }} />
                  <input
                    className="form-input"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{ paddingLeft: 38 }}
                    autoFocus required
                  />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 6 }}>10-digit numbers get +91 automatically</div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading || !phone.trim()}>
                <Phone size={15} />
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: OTP */}
        {step === STEP.OTP && (
          <div style={{ animation: 'slideUp 0.22s ease' }}>
            <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16, padding: '4px 0', color: 'var(--text-2)' }}
              onClick={() => { setStep(STEP.PHONE); setOtp(['','','','','','']); }}>
              <ArrowLeft size={14} /> Back
            </button>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 6 }}>Verify OTP</h1>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 28 }}>
              Sent to <strong style={{ color: 'var(--text-0)' }}>{formatPhone(phone)}</strong>
            </p>
            <form onSubmit={handleVerifyOTP}>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '0 0 28px' }} onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text" inputMode="numeric" maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    autoFocus={i === 0}
                    style={{
                      width: 46, height: 54, textAlign: 'center',
                      fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 700,
                      background: digit ? 'var(--accent-dim)' : 'var(--bg-0)',
                      border: `1.5px solid ${digit ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 10, color: digit ? 'var(--accent)' : 'var(--text-0)',
                      outline: 'none', transition: 'all 0.15s ease', caretColor: 'var(--accent)',
                    }}
                  />
                ))}
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading || otp.join('').length !== 6}>
                <Shield size={15} />
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
              <div style={{ textAlign: 'center', marginTop: 18 }}>
                {resendTimer > 0 ? (
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
                    Resend in <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{resendTimer}s</span>
                  </span>
                ) : (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={handleResend} disabled={loading}
                    style={{ fontSize: 13, color: 'var(--text-2)' }}>
                    <RefreshCw size={12} /> Resend OTP
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
