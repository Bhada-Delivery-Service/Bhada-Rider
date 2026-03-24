import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  User, Car, FileText, Send, CheckCircle, RefreshCw,
  LogOut, X, Camera, Eye, Loader, Banknote, ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ridersAPI, filesAPI, securityDepositAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../services/socketService';

/* ─────────────────────────────────────────────────────────────────────────────
   ImageUploadField — tap-to-upload with preview, supports camera on mobile
──────────────────────────────────────────────────────────────────────────────*/
function ImageUploadField({ label, value, onChange, required = false }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const [lightbox, setLightbox] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Max file size is 5 MB'); return; }

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);

    try {
      const { data } = await filesAPI.upload(file);
      // handle various response shapes the backend may use
      const url = data?.data?.url ?? data?.url ?? data?.fileUrl ?? data?.data?.fileUrl;
      if (!url) throw new Error('No URL in response');
      setPreview(url);
      onChange(url);
      toast.success('Photo uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
      setPreview(value || null);
      onChange(value || '');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: 11, fontFamily: 'var(--font-mono)',
        color: 'var(--text-2)', letterSpacing: '0.06em',
        textTransform: 'uppercase', marginBottom: 8,
      }}>
        {label}{required && <span style={{ color: 'var(--red)' }}> *</span>}
      </label>

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          position: 'relative', borderRadius: 10, overflow: 'hidden',
          border: `1.5px dashed ${preview ? 'rgba(54,211,153,0.5)' : 'var(--border-bright)'}`,
          background: 'var(--bg-2)', cursor: uploading ? 'wait' : 'pointer',
          minHeight: 88, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.2s',
        }}
      >
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 20 }}>
            <Loader size={22} style={{ color: 'var(--accent)', animation: 'ksp 0.8s linear infinite' }} />
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Uploading…</span>
          </div>
        ) : preview ? (
          <>
            <img src={preview} alt={label}
              style={{ width: '100%', maxHeight: 150, objectFit: 'cover', display: 'block' }} />
            <div style={{
              position: 'absolute', bottom: 6, right: 6, display: 'flex', gap: 6,
            }}>
              <button type="button"
                onClick={e => { e.stopPropagation(); setLightbox(true); }}
                style={overlayBtn}
              ><Eye size={11} /> View</button>
              <button type="button"
                onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
                style={overlayBtn}
              ><Camera size={11} /> Change</button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--bg-3)', display: 'grid', placeItems: 'center' }}>
              <Camera size={20} style={{ color: 'var(--text-2)' }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-1)' }}>Tap to upload photo</span>
            <span style={{ fontSize: 10, color: 'var(--text-2)' }}>JPG / PNG · max 5 MB</span>
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" capture="environment"
        style={{ display: 'none' }} onChange={handleFile} />

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(false)} style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.92)', display: 'grid', placeItems: 'center',
        }}>
          <img src={preview} alt={label}
            style={{ maxWidth: '90vw', maxHeight: '84vh', borderRadius: 10, objectFit: 'contain' }}
            onClick={e => e.stopPropagation()} />
          <button onClick={() => setLightbox(false)}
            style={{ position: 'absolute', top: 18, right: 18, ...overlayBtn }}>
            <X size={13} /> Close
          </button>
        </div>
      )}
      <style>{`@keyframes ksp{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

const overlayBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  background: 'rgba(13,18,32,0.82)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 6, padding: '4px 9px', color: '#f0f4ff',
  fontSize: 11, cursor: 'pointer',
};

/* ─────────────────────────────────────────────────────────────────────────────
   Modals
──────────────────────────────────────────────────────────────────────────────*/
function ProfileModal({ riderData, uid, onClose, onSave }) {
  const [form, setForm] = useState({
    firstName: riderData?.firstName || '',
    lastName: riderData?.lastName || '',
    email: riderData?.email || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.firstName.trim()) { toast.error('First name is required'); return; }
    setSaving(true);
    try {
      await ridersAPI.updateProfile(uid, form);
      toast.success('Profile saved!');
      onSave(); onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Personal Details</div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="form-group">
          <label className="form-label">First Name *</label>
          <input className="form-input" value={form.firstName} autoFocus
            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input className="form-input" value={form.lastName}
            onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="flex gap-8">
          <button className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary flex-1" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function VehicleModal({ uid, riderData, onClose, onSave }) {
  const existingVehicle = riderData?.vehicle || {
    vehicleType:   riderData?.vehicleType,
    vehicleNumber: riderData?.vehicleNumber,
  };
 
  const [form, setForm]             = useState({
    vehicleType:   existingVehicle?.vehicleType   || '',
    vehicleNumber: existingVehicle?.vehicleNumber || '',
  });
  const [saving, setSaving]         = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);  // ← dynamic
  const [loadingTypes, setLoadingTypes] = useState(true);
 
  // Fetch active vehicle types from backend on mount
  useEffect(() => {
    (async () => {
      try {
        // Uses your existing axios instance — same base URL as other API calls
        const { data } = await ridersAPI.getVehicleTypes();     // see api.js changes below
        const types = data?.data ?? data ?? [];
        setVehicleTypes(types);
        // Pre-select first type if form has no type yet
        if (!form.vehicleType && types.length > 0) {
          setForm(f => ({ ...f, vehicleType: types[0].id }));
        }
      } catch {
        // Fallback to a safe default so rider is not blocked
        setVehicleTypes([{ id: 'BIKE', name: 'Bike / Motorcycle', icon: '🏍️' }]);
        if (!form.vehicleType) setForm(f => ({ ...f, vehicleType: 'BIKE' }));
      } finally {
        setLoadingTypes(false);
      }
    })();
  }, []);
 
  const handleSave = async () => {
    if (!form.vehicleNumber.trim()) { toast.error('Enter vehicle number'); return; }
    if (!form.vehicleType)          { toast.error('Select vehicle type');  return; }
    setSaving(true);
    try {
      await ridersAPI.submitVehicle(uid, form);
      toast.success('Vehicle submitted!');
      onSave?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit vehicle');
    } finally {
      setSaving(false);
    }
  };
 
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-title">Vehicle Details</div>
 
        <div className="form-group">
          <label className="form-label">Vehicle Type</label>
          {loadingTypes ? (
            <div className="form-select" style={{ color: 'var(--text-tertiary)' }}>Loading…</div>
          ) : (
            <select
              className="form-select"
              value={form.vehicleType}
              onChange={e => setForm(f => ({ ...f, vehicleType: e.target.value }))}
            >
              {vehicleTypes.map(v => (
                <option key={v.id} value={v.id}>
                  {v.icon ? `${v.icon} ` : ''}{v.name}
                </option>
              ))}
            </select>
          )}
        </div>
 
        <div className="form-group">
          <label className="form-label">Vehicle Number</label>
          <input
            className="form-input"
            placeholder="e.g. MH01AB1234"
            value={form.vehicleNumber}
            onChange={e => setForm(f => ({ ...f, vehicleNumber: e.target.value.toUpperCase() }))}
          />
        </div>
 
        <div className="flex gap-8">
          <button className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary flex-1" onClick={handleSave} disabled={saving || loadingTypes}>
            {saving ? 'Submitting…' : 'Submit Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
}
function KycModal({ uid, riderData, onClose, onSave }) {
  // BUG FIX: kyc data is now in nested rd.kyc object; fall back to flat fields for legacy compat
  const existing = riderData?.kyc || {
    idProofType: riderData?.idProofType,
    idProofNumber: riderData?.idProofNumber,
    documentUrl: riderData?.documentUrl,
    documentUrlBack: riderData?.documentUrlBack,
  };
  const [form, setForm] = useState({
    idProofType: existing.idProofType || 'AADHAR',
    idProofNumber: existing.idProofNumber || '',
    documentUrl: existing.documentUrl || '',
    documentUrlBack: existing.documentUrlBack || '',
  });
  const [saving, setSaving] = useState(false);

  const needsBack = ['AADHAR', 'DRIVING_LICENCE'].includes(form.idProofType);

  const handleSave = async () => {
    if (!form.idProofNumber.trim()) { toast.error('Enter your ID number'); return; }
    if (!form.documentUrl) { toast.error('Please upload a front photo of your ID document'); return; }
    setSaving(true);
    try {
      await ridersAPI.submitKyc(uid, {
        idProofType: form.idProofType,
        idProofNumber: form.idProofNumber,
        documentUrl: form.documentUrl,
        ...(form.documentUrlBack ? { documentUrlBack: form.documentUrlBack } : {}),
      });
      toast.success('KYC submitted! Admin will verify within 24–48 hours.');
      onSave(); onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'KYC submission failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">KYC Verification</div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="form-group">
          <label className="form-label">ID Proof Type</label>
          <select className="form-select" value={form.idProofType}
            onChange={e => setForm(f => ({ ...f, idProofType: e.target.value }))}>
            <option value="AADHAR">Aadhaar Card</option>
            <option value="PAN">PAN Card</option>
            <option value="DRIVING_LICENCE">Driving Licence</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">ID Number *</label>
          <input className="form-input" placeholder="Enter your ID number"
            value={form.idProofNumber}
            onChange={e => setForm(f => ({ ...f, idProofNumber: e.target.value.toUpperCase() }))} />
        </div>

        {/* ── Front photo (required) ── */}
        <ImageUploadField
          label={`${form.idProofType === 'AADHAR' ? 'Aadhaar' : form.idProofType === 'PAN' ? 'PAN Card' : 'Driving Licence'} — Front Photo`}
          value={form.documentUrl}
          onChange={url => setForm(f => ({ ...f, documentUrl: url }))}
          required
        />

        {/* ── Back photo (Aadhaar / DL only) ── */}
        {needsBack && (
          <ImageUploadField
            label={`${form.idProofType === 'AADHAR' ? 'Aadhaar' : 'Driving Licence'} — Back Photo (optional)`}
            value={form.documentUrlBack}
            onChange={url => setForm(f => ({ ...f, documentUrlBack: url }))}
          />
        )}

        <div style={{
          padding: '10px 12px', background: 'var(--blue-dim)',
          borderRadius: 8, fontSize: 12, color: 'var(--blue)', marginBottom: 18, lineHeight: 1.5,
        }}>
          ℹ️ Make sure all text is clearly visible. Documents are verified within 24–48 hours.
        </div>

        <div className="flex gap-8">
          <button className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary flex-1" onClick={handleSave} disabled={saving}>
            {saving ? 'Submitting…' : 'Submit KYC'}
          </button>
        </div>
      </div>
    </div>
  );
}

function BankAccountModal({ uid, riderData, onClose, onSave }) {
  const existing = {
    bankAccountHolderName: riderData?.bankAccountHolderName || '',
    bankAccountNumber: riderData?.bankAccountNumber || '',
    bankIfscCode: riderData?.bankIfscCode || '',
    bankName: riderData?.bankName || '',
    upiId: riderData?.upiId || '',
  };

  const [form, setForm] = useState(existing);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState(
    existing.upiId && !existing.bankAccountNumber ? 'upi' : 'bank'
  );

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (mode === 'bank') {
      if (!form.bankAccountHolderName.trim()) { toast.error('Enter account holder name'); return; }
      if (!form.bankAccountNumber.trim()) { toast.error('Enter bank account number'); return; }
      if (!form.bankIfscCode.trim()) { toast.error('Enter IFSC code'); return; }
    } else {
      if (!form.upiId.trim()) { toast.error('Enter UPI ID'); return; }
    }
    setSaving(true);
    try {
      await ridersAPI.updateBankAccount(uid, {
        bankAccountHolderName: mode === 'bank' ? form.bankAccountHolderName.trim() : undefined,
        bankAccountNumber: mode === 'bank' ? form.bankAccountNumber.trim() : undefined,
        bankIfscCode: mode === 'bank' ? form.bankIfscCode.trim().toUpperCase() : undefined,
        bankName: mode === 'bank' ? form.bankName.trim() : undefined,
        upiId: mode === 'upi' ? form.upiId.trim() : undefined,
      });
      toast.success('Bank account saved!');
      onSave(); onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save bank details');
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Payout Account</div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 16, lineHeight: 1.5 }}>
          Add your bank or UPI details so admin can transfer your earnings directly.
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex', background: 'var(--bg-2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', padding: 3, marginBottom: 20,
        }}>
          {[
            { key: 'bank', label: '🏦 Bank Transfer' },
            { key: 'upi',  label: '📱 UPI' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setMode(key)} style={{
              flex: 1, background: mode === key ? 'var(--bg-1)' : 'transparent',
              border: `1px solid ${mode === key ? 'var(--border-bright)' : 'transparent'}`,
              borderRadius: 6, padding: '8px 0',
              color: mode === key ? 'var(--text-0)' : 'var(--text-2)',
              fontSize: 13, fontWeight: mode === key ? 600 : 400, cursor: 'pointer',
            }}>{label}</button>
          ))}
        </div>

        {mode === 'bank' ? (
          <>
            <div className="form-group">
              <label className="form-label">Account Holder Name *</label>
              <input className="form-input" placeholder="As on bank passbook"
                value={form.bankAccountHolderName}
                onChange={e => upd('bankAccountHolderName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Account Number *</label>
              <input className="form-input" placeholder="e.g. 1234567890123"
                value={form.bankAccountNumber}
                onChange={e => upd('bankAccountNumber', e.target.value.replace(/\D/g, ''))} />
            </div>
            <div className="form-group">
              <label className="form-label">IFSC Code *</label>
              <input className="form-input" placeholder="e.g. SBIN0001234"
                value={form.bankIfscCode}
                onChange={e => upd('bankIfscCode', e.target.value.toUpperCase())} />
            </div>
            <div className="form-group">
              <label className="form-label">Bank Name</label>
              <input className="form-input" placeholder="e.g. State Bank of India"
                value={form.bankName}
                onChange={e => upd('bankName', e.target.value)} />
            </div>
          </>
        ) : (
          <div className="form-group">
            <label className="form-label">UPI ID *</label>
            <input className="form-input" placeholder="e.g. yourname@upi or 9876543210@okaxis"
              value={form.upiId}
              onChange={e => upd('upiId', e.target.value.trim())} />
          </div>
        )}

        <div style={{
          padding: '10px 12px', background: 'var(--green-dim)',
          border: '1px solid rgba(54,211,153,0.2)',
          borderRadius: 8, fontSize: 12, color: 'var(--text-1)', marginBottom: 18, lineHeight: 1.5,
        }}>
          🔒 Your account details are securely stored and only visible to Bhada admin for processing payouts.
        </div>

        <div className="flex gap-8">
          <button className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary flex-1" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
/* ─────────────────────────────────────────────────────────────────────────────
   SecurityDepositModal — initiate and verify Razorpay payment for deposit
──────────────────────────────────────────────────────────────────────────────*/
/* Dynamically injects the Razorpay checkout script and resolves when ready */
function loadRazorpaySDK() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload  = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
}

function SecurityDepositModal({ onClose, onPaid }) {
  const [depositInfo, setDepositInfo] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [paying, setPaying]           = useState(false);
  const [verifying, setVerifying]     = useState(false);

  // Load current deposit status / required amount on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await securityDepositAPI.getMy();
        const d = data?.data;
        if (d?.status === 'PAID') { onPaid(); onClose(); return; }
        setDepositInfo({ requiredAmount: data?.requiredAmount || d?.amount || 0, deposit: d });
      } catch (err) {
        toast.error('Failed to load deposit info');
        onClose();
      } finally { setLoading(false); }
    })();
  }, []); // eslint-disable-line

  const handlePay = async () => {
    setPaying(true);
    try {
      // Step 1: Initiate — get Razorpay order
      const { data } = await securityDepositAPI.initiate();
      const { gatewayOrderId, amount, alreadyPaid } = data.data;

      if (alreadyPaid) { toast.success('Deposit already paid!'); onPaid(); onClose(); return; }

      // Step 2: Dynamically load Razorpay SDK if not already present
      try {
        await loadRazorpaySDK();
      } catch {
        toast.error('Could not load payment SDK. Check your internet connection.');
        setPaying(false);
        return;
      }

      // Step 3: Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        order_id: gatewayOrderId,
        amount: amount * 100, // paise
        currency: 'INR',
        name: 'Bhada Security Deposit',
        description: 'One-time refundable security deposit',
        handler: async (response) => {
          // Step 4: Verify payment
          setVerifying(true);
          try {
            await securityDepositAPI.verify({
              gatewayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Security deposit paid successfully! 🎉');
            onPaid();
            onClose();
          } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed. Contact support if amount was deducted.');
          } finally { setVerifying(false); }
        },
        modal: { ondismiss: () => setPaying(false) },
        theme: { color: '#00e5a0' },
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
      setPaying(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Security Deposit</div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <Loader size={24} style={{ color: 'var(--accent)', animation: 'ksp 0.8s linear infinite' }} />
          </div>
        ) : verifying ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <Loader size={24} style={{ color: 'var(--accent)', animation: 'ksp 0.8s linear infinite' }} />
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-2)' }}>Verifying payment…</div>
          </div>
        ) : (
          <>
            {/* Amount */}
            <div style={{
              textAlign: 'center', padding: '20px 0 24px',
              borderBottom: '1px solid var(--border)', marginBottom: 20,
            }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                Deposit Amount
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em' }}>
                ₹{depositInfo?.requiredAmount ?? 0}
              </div>
            </div>

            {/* Info */}
            <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.7, marginBottom: 20 }}>
              A one-time <strong>refundable security deposit</strong> is required before your onboarding can be approved. This amount will be returned to you when you leave the platform in good standing.
            </div>

            <div style={{
              padding: '10px 12px', background: 'var(--blue-dim)',
              borderRadius: 8, fontSize: 12, color: 'var(--blue)', marginBottom: 20, lineHeight: 1.5,
            }}>
              🔒 Payment is processed securely via Razorpay. Your money is safe.
            </div>

            <div className="flex gap-8">
              <button className="btn btn-secondary flex-1" onClick={onClose} disabled={paying}>Cancel</button>
              <button className="btn btn-primary flex-1" onClick={handlePay} disabled={paying}>
                {paying ? <><Loader size={13} style={{ animation: 'ksp 0.8s linear infinite' }} /> Processing…</> : `Pay ₹${depositInfo?.requiredAmount ?? 0}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


export default function OnboardingGatePage() {
  const { user, logout, updateRider, refreshOnboardingStatus, onboardingStatus } = useAuth();
  const [riderData, setRiderData] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal]         = useState(null); // 'profile' | 'vehicle' | 'kyc' | 'bank' | 'security_deposit'
  const [depositStatus, setDepositStatus] = useState(null); // null | 'PENDING_PAYMENT' | 'PAID'

  /* ── Fetch deposit status ────────────────────────────────────────────────── */
  const fetchDepositStatus = useCallback(async () => {
    try {
      const { data } = await securityDepositAPI.getMy();
      if (data?.data?.status) setDepositStatus(data.data.status);
      else if (data?.isRequired === false) setDepositStatus('PAID'); // feature disabled
    } catch { /* ignore — deposit feature may not be enabled */ }
  }, []);

  /* ── Fetch rider from server ─────────────────────────────────────────────── */
  const fetchRider = useCallback(async (silent = false) => {
    if (!user?.uid) return;
    if (!silent) setLoading(true);
    try {
      const { data } = await ridersAPI.getById(user.uid);
      const rd = data?.data || data;
      setRiderData(rd);
      updateRider(rd);
    } catch (err) {
      if (err.response?.status === 404) setRiderData(null);
      else toast.error('Failed to load profile');
    } finally { setLoading(false); }
  }, [user?.uid]); // eslint-disable-line

  useEffect(() => { fetchRider(); fetchDepositStatus(); }, [fetchRider, fetchDepositStatus]);

  /* ── Real-time socket: re-render immediately when admin acts ─────────────── */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onNotification = ({ type }) => {
      if (['KYC_APPROVED', 'KYC_REJECTED', 'ONBOARDING_APPROVED', 'ONBOARDING_REJECTED'].includes(type)) {
        fetchRider(true);
        refreshOnboardingStatus();
      }
    };

    // BUG FIX: listen to rider:updated event emitted by backend after any
    // vehicle/KYC/onboarding change, so the UI updates in real time without
    // the rider needing to refresh. The backend now emits this on every mutation.
    const onRiderUpdated = ({ rider }) => {
      if (rider) {
        setRiderData(rider);
        updateRider(rider);
      }
    };

    socket.on('notification:new', onNotification);
    socket.on('rider:updated', onRiderUpdated);
    return () => {
      socket.off('notification:new', onNotification);
      socket.off('rider:updated', onRiderUpdated);
    };
  }, [fetchRider, refreshOnboardingStatus]);

  /* ── Handlers ────────────────────────────────────────────────────────────── */
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshOnboardingStatus(), fetchRider(true), fetchDepositStatus()]);
    setRefreshing(false);
    toast.success('Status refreshed');
  };

  const submitOnboarding = async () => {
    try {
      await ridersAPI.submitOnboarding(user.uid);
      toast.success('Application submitted! Waiting for admin approval.');
      await Promise.all([fetchRider(true), refreshOnboardingStatus()]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    }
  };

  /* ── Loading splash ──────────────────────────────────────────────────────── */
  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)', display: 'grid', placeItems: 'center' }}>
      <div className="loader" />
    </div>
  );

  /* ── Derived state ───────────────────────────────────────────────────────── */
  const rd         = riderData;
  const hasProfile = !!(rd?.firstName);
  // BUG FIX: backend returns nested `vehicle` object — was reading undefined flat fields
  const hasVehicle = !!(rd?.vehicle?.vehicleType && rd?.vehicle?.vehicleNumber)
                  || !!(rd?.vehicleType && rd?.vehicleNumber); // backward compat
  // BUG FIX: kycStatus was compared to 'APPROVED' but backend enum is 'VERIFIED'
  //          Also support nested `rd.kyc.kycStatus` (new) and flat `rd.kycStatus` (legacy)
  const rawKycStatus = rd?.kyc?.kycStatus || rd?.kycStatus || 'NOT_SUBMITTED';
  const kycStatus  = rawKycStatus === 'VERIFIED' ? 'APPROVED' : rawKycStatus;
  const obStatus   = onboardingStatus || rd?.onboardingStatus || 'NOT_SUBMITTED';
  const hasBankAccount = !!(rd?.bankAccountNumber || rd?.upiId);

  const depositPaid = depositStatus === 'PAID';
  const depositPending = depositStatus === 'PENDING_PAYMENT';

  /* ── Steps definition ────────────────────────────────────────────────────── */
  const steps = [
    {
      id: 'profile', Icon: User,
      title: 'Personal Details',
      desc: 'Your name and contact information',
      done: hasProfile,
      pending: false,
      rejected: false,
      // Profile can always be re-edited
      canAct: true,
      label: hasProfile ? 'Edit' : 'Complete Profile',
      action: () => setModal('profile'),
    },
    {
      id: 'vehicle', Icon: Car,
      title: 'Vehicle Details',
      desc: 'Vehicle type and registration number',
      done: hasVehicle,
      pending: false,
      rejected: false,
      canAct: hasProfile,
      label: hasVehicle ? 'Edit' : 'Add Vehicle',
      action: () => setModal('vehicle'),
    },
    {
      id: 'kyc', Icon: FileText,
      title: 'KYC Verification',
      desc: 'Government-issued ID + photo of document',
      done: kycStatus === 'APPROVED',
      pending: kycStatus === 'PENDING',
      rejected: kycStatus === 'REJECTED',
      canAct: hasVehicle && kycStatus !== 'APPROVED' && kycStatus !== 'PENDING',
      label: kycStatus === 'REJECTED' ? 'Resubmit KYC' : 'Submit KYC',
      action: () => setModal('kyc'),
    },
    {
      id: 'bank', Icon: Banknote,
      title: 'Payout Account',
      desc: 'Bank account or UPI ID for receiving payments',
      done: hasBankAccount,
      pending: false,
      rejected: false,
      canAct: kycStatus === 'APPROVED' || kycStatus === 'PENDING',
      label: hasBankAccount ? 'Edit Account' : 'Add Payout Account',
      action: () => setModal('bank'),
    },
    {
      id: 'security_deposit', Icon: ShieldCheck,
      title: 'Security Deposit',
      desc: 'One-time refundable deposit required before approval',
      done: depositPaid,
      pending: false,
      rejected: false,
      canAct: hasBankAccount && (kycStatus === 'APPROVED' || kycStatus === 'PENDING') && !depositPaid,
      label: depositPending ? 'Pay Deposit' : 'Pay Security Deposit',
      action: () => setModal('security_deposit'),
    },
    {
      id: 'onboarding', Icon: Send,
      title: 'Submit Application',
      desc: 'Send your application for admin review',
      done: obStatus === 'APPROVED',
      pending: obStatus === 'PENDING',
      rejected: obStatus === 'REJECTED',
      canAct: kycStatus === 'APPROVED' && hasBankAccount && depositPaid && (obStatus === 'NOT_SUBMITTED' || obStatus === 'REJECTED'),
      label: obStatus === 'REJECTED' ? 'Resubmit Application' : 'Submit Application',
      action: submitOnboarding,
    },
  ];

  const completedCount = steps.filter(s => s.done).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  /* ── Step visual helpers ─────────────────────────────────────────────────── */
  const stepState = (s) =>
    s.done ? 'done' : s.pending ? 'pending' : s.rejected ? 'rejected' : s.canAct ? 'active' : 'locked';

  const STATE = {
    done:     { border: 'rgba(54,211,153,0.2)',  iconBg: 'var(--green-dim)',  iconColor: 'var(--green)' },
    pending:  { border: 'rgba(255,154,60,0.2)',  iconBg: 'var(--orange-dim)', iconColor: 'var(--orange)' },
    rejected: { border: 'rgba(255,77,109,0.2)',  iconBg: 'var(--red-dim)',    iconColor: 'var(--red)' },
    active:   { border: 'rgba(0,229,160,0.25)',  iconBg: 'var(--accent-dim)', iconColor: 'var(--accent)' },
    locked:   { border: 'var(--border)',          iconBg: 'var(--bg-3)',       iconColor: 'var(--text-2)' },
  };

  const stateDesc = (s, state) => {
    if (state === 'done')     return <span style={{ color: 'var(--green)' }}>✓ Verified &amp; complete</span>;
    if (state === 'pending')  return <span style={{ color: 'var(--orange)' }}>⏳ Under admin review</span>;
    if (state === 'rejected') return <span style={{ color: 'var(--red)' }}>✗ Rejected — tap to resubmit</span>;
    return <span style={{ color: 'var(--text-2)' }}>{s.desc}</span>;
  };

  /* ── Render ──────────────────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        padding: '16px 20px', background: 'var(--bg-1)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: 'var(--accent)', borderRadius: 10,
            display: 'grid', placeItems: 'center',
            color: 'var(--bg-0)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16,
          }}>B</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Bhada Rider</div>
            <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>ONBOARDING</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={logout} style={{ gap: 6, fontSize: 12, color: 'var(--text-2)' }}>
          <LogOut size={13} /> Sign Out
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '24px 16px', maxWidth: 480, margin: '0 auto', width: '100%' }}>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Welcome{rd?.firstName ? `, ${rd.firstName}` : ''}! 👋
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
            Complete all steps below to start delivering with Bhada.
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>PROGRESS</span>
            <span style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{progress}%</span>
          </div>
          <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`, background: 'var(--accent)', borderRadius: 99,
              transition: 'width 0.4s ease', boxShadow: '0 0 10px var(--accent-glow)',
            }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 6 }}>
            {completedCount} of {steps.length} steps completed
          </div>
        </div>

        {/* Banners */}
        {obStatus === 'PENDING' && (
          <div style={{ padding: '14px 16px', marginBottom: 20, background: 'var(--orange-dim)', border: '1px solid rgba(255,154,60,0.2)', borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>⏳</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--orange)', marginBottom: 3 }}>Application Under Review</div>
              <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.5 }}>
                You'll be notified instantly when approved. Tap to manually refresh.
              </div>
              <button className="btn btn-sm"
                style={{ marginTop: 10, background: 'var(--orange-dim)', color: 'var(--orange)', border: '1px solid rgba(255,154,60,0.3)' }}
                onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw size={12} style={{ animation: refreshing ? 'ksp 0.7s linear infinite' : 'none' }} />
                {refreshing ? 'Checking…' : 'Check Status'}
              </button>
            </div>
          </div>
        )}

        {obStatus === 'REJECTED' && (
          <div style={{ padding: '14px 16px', marginBottom: 20, background: 'var(--red-dim)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: 12, display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>✗</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--red)', marginBottom: 3 }}>Application Rejected</div>
              <div style={{ fontSize: 12, color: 'var(--text-1)' }}>Update your details and resubmit below.</div>
            </div>
          </div>
        )}

        {kycStatus === 'REJECTED' && obStatus !== 'REJECTED' && (
          <div style={{ padding: '14px 16px', marginBottom: 20, background: 'var(--red-dim)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: 12, display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--red)', marginBottom: 3 }}>KYC Rejected</div>
              <div style={{ fontSize: 12, color: 'var(--text-1)' }}>Resubmit with a clear, readable photo of your ID.</div>
            </div>
          </div>
        )}

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {steps.map(step => {
            const state  = stepState(step);
            const visual = STATE[state];
            const { Icon } = step;

            return (
              <div key={step.id} style={{
                background: 'var(--bg-1)', border: `1px solid ${visual.border}`,
                borderRadius: 12, padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 14,
                opacity: state === 'locked' ? 0.5 : 1, transition: 'all 0.2s ease',
              }}>
                {/* Icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  display: 'grid', placeItems: 'center',
                  background: visual.iconBg, color: visual.iconColor,
                }}>
                  {state === 'done' ? <CheckCircle size={18} /> : <Icon size={18} />}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: state === 'locked' ? 'var(--text-2)' : 'var(--text-0)', marginBottom: 2 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 12 }}>{stateDesc(step, state)}</div>

                  {/* KYC doc preview link when submitted */}
                  {step.id === 'kyc' && (rd?.kyc?.documentUrl || rd?.documentUrl) && (state === 'done' || state === 'pending') && (
                    <a href={rd.kyc?.documentUrl || rd.documentUrl} target="_blank" rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 5, fontSize: 10, color: 'var(--blue)', background: 'var(--blue-dim)', padding: '2px 8px', borderRadius: 4, textDecoration: 'none' }}>
                      <Eye size={9} /> View submitted doc
                    </a>
                  )}

                  {/* Bank account saved info */}
                  {step.id === 'bank' && state === 'done' && (
                    <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                      {rd?.upiId
                        ? `UPI: ${rd.upiId}`
                        : rd?.bankAccountNumber
                          ? `A/C: ••••${rd.bankAccountNumber.slice(-4)} · ${rd.bankIfscCode || ''}`
                          : 'Account saved'}
                    </div>
                  )}

                  {/* Security deposit paid */}
                  {step.id === 'security_deposit' && state === 'done' && (
                    <div style={{ marginTop: 4, fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
                      ✓ Deposit paid & verified
                    </div>
                  )}
                </div>

                {/* ✅ Action button — never shown when done OR pending */}
                {step.canAct && !step.done && !step.pending && (
                  <button
                    className={`btn btn-sm ${state === 'rejected' ? 'btn-danger' : 'btn-primary'}`}
                    style={{ flexShrink: 0, fontSize: 12 }}
                    onClick={step.action}
                  >
                    {step.label}
                  </button>
                )}

                {state === 'locked' && <span style={{ fontSize: 18, flexShrink: 0 }}>🔒</span>}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-2)' }}>
          Need help? Contact Bhada support.
        </div>
      </div>

      {/* Modals */}
      {modal === 'profile' && (
        <ProfileModal uid={user.uid} riderData={rd} onClose={() => setModal(null)} onSave={() => fetchRider(true)} />
      )}
      {modal === 'vehicle' && (
        <VehicleModal uid={user.uid} riderData={rd} onClose={() => setModal(null)} onSave={() => fetchRider(true)} />
      )}
      {modal === 'kyc' && (
        <KycModal uid={user.uid} riderData={rd} onClose={() => setModal(null)} onSave={() => fetchRider(true)} />
      )}
      {modal === 'bank' && (
        <BankAccountModal uid={user.uid} riderData={rd} onClose={() => setModal(null)} onSave={() => fetchRider(true)} />
      )}
      {modal === 'security_deposit' && (
        <SecurityDepositModal
          onClose={() => setModal(null)}
          onPaid={() => { setDepositStatus('PAID'); fetchDepositStatus(); }}
        />
      )}

      <style>{`@keyframes ksp{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}