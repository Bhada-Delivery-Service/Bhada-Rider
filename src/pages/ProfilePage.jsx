import React, { useState, useEffect } from 'react';
import { User, Car, FileText, Send, CheckCircle, Clock, XCircle, RefreshCw, ChevronRight, Edit2, X, Banknote, Sun, Moon, Languages, Volume2, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { ridersAPI, filesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RING_TONES, getSelectedTone, setSelectedTone, previewTone } from '../services/soundService';

import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';

function BankAccountModal({ uid, riderData, onClose, onSave }) {
  const { t } = useLang();
  const [form, setForm] = useState({
    bankAccountHolderName: riderData?.bankAccountHolderName || '',
    bankAccountNumber: riderData?.bankAccountNumber || '',
    bankIfscCode: riderData?.bankIfscCode || '',
    bankName: riderData?.bankName || '',
    upiId: riderData?.upiId || '',
  });
  const [mode, setMode] = useState(
    riderData?.upiId && !riderData?.bankAccountNumber ? 'upi' : 'bank'
  );
  const [loading, setLoading] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (mode === 'bank') {
      if (!form.bankAccountHolderName.trim()) { toast.error('Enter account holder name'); return; }
      if (!form.bankAccountNumber.trim()) { toast.error('Enter bank account number'); return; }
      if (!form.bankIfscCode.trim()) { toast.error('Enter IFSC code'); return; }
    } else {
      if (!form.upiId.trim()) { toast.error('Enter UPI ID'); return; }
    }
    setLoading(true);
    try {
      await ridersAPI.updateBankAccount(uid, {
        bankAccountHolderName: mode === 'bank' ? form.bankAccountHolderName.trim() : undefined,
        bankAccountNumber: mode === 'bank' ? form.bankAccountNumber.trim() : undefined,
        bankIfscCode: mode === 'bank' ? form.bankIfscCode.trim().toUpperCase() : undefined,
        bankName: mode === 'bank' ? form.bankName.trim() : undefined,
        upiId: mode === 'upi' ? form.upiId.trim() : undefined,
      });
      toast.success('Payout account updated!');
      onSave(); onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{t('payout_account')}</div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex', background: 'var(--bg-2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', padding: 3, marginBottom: 20,
        }}>
          {[{ key: 'bank', label: t('bank') }, { key: 'upi', label: t('upi') }].map(({ key, label }) => (
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
              <label className="form-label">{t('account_holder')}</label>
              <input className="form-input" {...{placeholder:t('account_holder_ph')}}
                value={form.bankAccountHolderName} onChange={e => upd('bankAccountHolderName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('account_number')}</label>
              <input className="form-input" {...{placeholder:t('account_number_ph')}}
                value={form.bankAccountNumber} onChange={e => upd('bankAccountNumber', e.target.value.replace(/\D/g, ''))} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('ifsc_code')}</label>
              <input className="form-input" {...{placeholder:t('ifsc_ph')}}
                value={form.bankIfscCode} onChange={e => upd('bankIfscCode', e.target.value.toUpperCase())} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('bank_name')}</label>
              <input className="form-input" {...{placeholder:t('bank_name_ph')}}
                value={form.bankName} onChange={e => upd('bankName', e.target.value)} />
            </div>
          </>
        ) : (
          <div className="form-group">
            <label className="form-label">{t('upi_id')}</label>
            <input className="form-input" {...{placeholder:t('upi_ph')}}
              value={form.upiId} onChange={e => upd('upiId', e.target.value.trim())} />
          </div>
        )}

        <div className="flex gap-8">
          <button className="btn btn-secondary flex-1" onClick={onClose}>{t('cancel')}</button>
          <button className="btn btn-primary flex-1" onClick={handleSave} disabled={loading}>
            {loading ? t('saving') : t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ steps, current }) {
  return (
    <div className="step-list">
      {steps.map((step, i) => {
        const state = step.done ? 'done' : i === current ? 'active' : 'pending';
        return (
          <div key={step.id} className="step-item">
            <div className={`step-dot ${state}`}>
              {step.done ? '✓' : i + 1}
            </div>
            <div className="step-content">
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProfileEditModal({ riderData, onClose, onSave, uid }) {
  const { t } = useLang();
  const [form, setForm] = useState({
    firstName: riderData?.firstName || '',
    lastName: riderData?.lastName || '',
    email: riderData?.email || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await ridersAPI.updateProfile(uid, form);
      toast.success('Profile updated');
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{t('edit_profile')}</div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="form-group">
          <label className="form-label">{t('first_name')}</label>
          <input className="form-input" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">{t('last_name')}</label>
          <input className="form-input" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">{t('email')}</label>
          <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="flex gap-8">
          <button className="btn btn-secondary flex-1" onClick={onClose}>{t('cancel')}</button>
          <button className="btn btn-primary flex-1" onClick={handleSave} disabled={loading}>
            {loading ? t('saving') : t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}

function VehicleModal({ onClose, onSave, uid }) {
  const { t } = useLang();
  const [form, setForm] = useState({ vehicleType: 'BIKE', vehicleNumber: '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.vehicleNumber.trim()) { toast.error('Enter vehicle number'); return; }
    setLoading(true);
    try {
      await ridersAPI.submitVehicle(uid, form);
      toast.success('Vehicle submitted!');
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit vehicle');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{t('vehicle_details')}</div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="form-group">
          <label className="form-label">{t('vehicle_type')}</label>
          <select className="form-select" value={form.vehicleType} onChange={e => setForm(f => ({ ...f, vehicleType: e.target.value }))}>
            <option value="BIKE">Bike</option>
            <option value="SCOOTER">Scooter</option>
            <option value="CYCLE">Cycle</option>
            <option value="CAR">Car</option>
            <option value="VAN">Van</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">{t('vehicle_number')}</label>
          <input className="form-input" placeholder="e.g. MH01AB1234" value={form.vehicleNumber}
            onChange={e => setForm(f => ({ ...f, vehicleNumber: e.target.value.toUpperCase() }))} />
        </div>
        <div className="flex gap-8">
          <button className="btn btn-secondary flex-1" onClick={onClose}>{t('cancel')}</button>
          <button className="btn btn-primary flex-1" onClick={handleSave} disabled={loading}>
            {loading ? t('submitting') : t('submit_vehicle')}
          </button>
        </div>
      </div>
    </div>
  );
}

function KycModal({ onClose, onSave, uid }) {
  const { t } = useLang();
  const [form, setForm] = useState({ idProofType: 'AADHAR', idProofNumber: '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.idProofNumber.trim()) { toast.error('Enter ID number'); return; }
    setLoading(true);
    try {
      await ridersAPI.submitKyc(uid, form);
      toast.success('KYC submitted!');
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'KYC submission failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{t('kyc_documents')}</div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="form-group">
          <label className="form-label">{t('id_proof_type')}</label>
          <select className="form-select" value={form.idProofType} onChange={e => setForm(f => ({ ...f, idProofType: e.target.value }))}>
            <option value="AADHAR">{t('aadhaar')}</option>
            <option value="PAN">{t('pan')}</option>
            <option value="DRIVING_LICENCE">{t('driving_licence')}</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">{t('id_proof_number')}</label>
          <input className="form-input" placeholder="Enter ID number" value={form.idProofNumber}
            onChange={e => setForm(f => ({ ...f, idProofNumber: e.target.value.toUpperCase() }))} />
        </div>
        <div style={{ padding: '10px 12px', background: 'var(--blue-dim)', borderRadius: 8, fontSize: 12, color: 'var(--blue)', marginBottom: 16 }}>
          {t('kyc_note')}
        </div>
        <div className="flex gap-8">
          <button className="btn btn-secondary flex-1" onClick={onClose}>{t('cancel')}</button>
          <button className="btn btn-primary flex-1" onClick={handleSave} disabled={loading}>
            {loading ? t('submitting') : t('submit_kyc')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout, updateRider } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { lang, setLang, t } = useLang();
  const [riderData, setRiderData] = useState(null);
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTone, setSelectedToneState] = useState(() => getSelectedTone());
  const [modal, setModal] = useState(null);

  const fetchRider = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const [rRes, oRes] = await Promise.allSettled([
        ridersAPI.getById(user.uid),
        ridersAPI.getOnboardingStatus(user.uid),
      ]);
      if (rRes.status === 'fulfilled') {
        const rd = rRes.value.data?.data || rRes.value.data;
        setRiderData(rd);
        updateRider(rd);
      }
      if (oRes.status === 'fulfilled') {
        setOnboardingStatus(oRes.value.data?.data || oRes.value.data);
      }
    } catch (_) { toast.error('Failed to load profile'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRider(); }, [user?.uid]);

  const submitOnboarding = async () => {
    try {
      await ridersAPI.submitOnboarding(user.uid);
      toast.success('Onboarding application submitted!');
      fetchRider();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    }
  };

  if (loading) return <div className="loading-center"><div className="loader" /></div>;

  const rd = riderData;
  const hasVehicle = !!(rd?.vehicleType && rd?.vehicleNumber);
  const kycStatus = rd?.kycStatus || 'NOT_SUBMITTED';
  const obStatus = rd?.onboardingStatus || 'NOT_SUBMITTED';

  const steps = [
    { id: 'profile',    title: t('personal_profile'),  desc: t('name_email_info'),    done: !!(rd?.firstName) },
    { id: 'vehicle',    title: t('vehicle_details'),   desc: t('vehicle_desc'),        done: hasVehicle },
    { id: 'kyc',        title: t('kyc_documents'),     desc: t('kyc_desc'),            done: kycStatus === 'APPROVED' },
    { id: 'onboarding', title: t('onboarding_app'),    desc: t('onboarding_desc'),     done: obStatus === 'APPROVED' },
  ];

  const currentStep = steps.findIndex(s => !s.done);

  const kycBadge = {
    APPROVED:      <span className="badge green">{t('verified')}</span>,
    PENDING:       <span className="badge orange">{t('pending_review')}</span>,
    REJECTED:      <span className="badge red">{t('rejected')}</span>,
    NOT_SUBMITTED: <span className="badge neutral">{t('not_submitted')}</span>,
  }[kycStatus] || <span className="badge neutral">{kycStatus}</span>;

  const obBadge = {
    APPROVED:      <span className="badge green">{t('approved')}</span>,
    PENDING:       <span className="badge orange">{t('pending_review')}</span>,
    REJECTED:      <span className="badge red">{t('rejected')}</span>,
    NOT_SUBMITTED: <span className="badge neutral">{t('not_submitted')}</span>,
  }[obStatus] || <span className="badge neutral">{obStatus}</span>;

  return (
    <div>
      <div className="flex items-center justify-between mb-16">
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>{t('profile')}</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{t('manage_account')}</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchRider} style={{ padding: 8 }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Avatar + info */}
      <div className="card mb-12">
        <div className="flex items-center gap-12 mb-12">
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'var(--accent-dim)', border: '2px solid var(--accent)',
            display: 'grid', placeItems: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--accent)',
            flexShrink: 0,
          }}>
            {(rd?.firstName?.[0] || user?.phoneNumber?.[0] || 'R').toUpperCase()}
          </div>
          <div className="flex-1">
            <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-0)' }}>
              {rd?.firstName ? `${rd.firstName} ${rd?.lastName || ''}`.trim() : 'Rider'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{user?.phoneNumber || '—'}</div>
            {rd?.email && <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{rd.email}</div>}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setModal('profile')} style={{ padding: 8 }}>
            <Edit2 size={14} />
          </button>
        </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase' }}>{t('kyc_status')}</div>
            {kycBadge}
          </div>
          <div style={{ padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase' }}>{t('onboarding')}</div>
            {obBadge}
          </div>
          {rd?.vehicleType && (
            <div style={{ padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase' }}>{t('vehicle')}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)' }}>{rd.vehicleType}</div>
            </div>
          )}
          {rd?.vehicleNumber && (
            <div style={{ padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase' }}>{t('reg_number')}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)', fontFamily: 'var(--font-mono)' }}>{rd.vehicleNumber}</div>
            </div>
          )}
        </div>
      </div>

      {/* Onboarding steps */}
      {obStatus !== 'APPROVED' && (
        <div className="card mb-12">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            {t('complete_setup')}
          </div>
          <StepIndicator steps={steps} current={currentStep === -1 ? steps.length : currentStep} />

          {/* Action buttons */}
          <div className="divider" />
          <div className="flex flex-col gap-8">
            {!rd?.firstName && (
              <button className="btn btn-secondary" onClick={() => setModal('profile')}>
                <User size={14} /> {t('complete_profile')}
              </button>
            )}
            {rd?.firstName && !hasVehicle && (
              <button className="btn btn-secondary" onClick={() => setModal('vehicle')}>
                <Car size={14} /> {t('add_vehicle')}
              </button>
            )}
            {hasVehicle && kycStatus === 'NOT_SUBMITTED' && (
              <button className="btn btn-secondary" onClick={() => setModal('kyc')}>
                <FileText size={14} /> {t('submit_kyc')}
              </button>
            )}
            {kycStatus === 'APPROVED' && obStatus === 'NOT_SUBMITTED' && (
              <button className="btn btn-primary" onClick={submitOnboarding}>
                <Send size={14} /> {t('submit_onboarding')}
              </button>
            )}
            {obStatus === 'PENDING' && (
              <div style={{ padding: '12px', background: 'var(--orange-dim)', borderRadius: 8, fontSize: 13, color: 'var(--orange)' }}>
                {t('under_review')}
              </div>
            )}
            {obStatus === 'REJECTED' && (
              <div style={{ padding: '12px', background: 'var(--red-dim)', borderRadius: 8, fontSize: 13, color: 'var(--red)' }}>
                {t('rejected_msg')}
                <button className="btn btn-danger btn-sm" style={{ marginTop: 10, width: '100%' }} onClick={submitOnboarding}>
                  {t('resubmit')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {obStatus === 'APPROVED' && (
        <div className="card mb-12" style={{ background: 'var(--green-dim)', borderColor: 'rgba(54,211,153,0.2)' }}>
          <div className="flex items-center gap-10">
            <CheckCircle size={20} style={{ color: 'var(--green)', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--green)' }}>{t('fully_onboarded')}</div>
              <div style={{ fontSize: 12, color: 'var(--text-1)' }}>{t('approved_msg')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Payout Account */}
      <div className="card mb-12">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Banknote size={16} style={{ color: 'var(--accent)' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>{t('payout_account')}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setModal('bank')} style={{ padding: 8 }}>
            <Edit2 size={14} />
          </button>
        </div>

        {rd?.bankAccountNumber || rd?.upiId ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rd?.upiId && (
              <div style={{ padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase' }}>UPI ID</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)', fontFamily: 'var(--font-mono)' }}>{rd.upiId}</div>
              </div>
            )}
            {rd?.bankAccountNumber && (
              <>
                {rd?.bankAccountHolderName && (
                  <div style={{ padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase' }}>{t('account_holder').replace(' *','')}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)' }}>{rd.bankAccountHolderName}</div>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase' }}>{t('account_no')}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)', fontFamily: 'var(--font-mono)' }}>
                      ••••{rd.bankAccountNumber.slice(-4)}
                    </div>
                  </div>
                  {rd?.bankIfscCode && (
                    <div style={{ padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase' }}>IFSC</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)', fontFamily: 'var(--font-mono)' }}>{rd.bankIfscCode}</div>
                    </div>
                  )}
                </div>
                {rd?.bankName && (
                  <div style={{ padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase' }}>{t('bank_name')}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)' }}>{rd.bankName}</div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>
              {t('no_payout_added')}
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setModal('bank')}>
              <Banknote size={13} /> {t('add_payout')}
            </button>
          </div>
        )}
      </div>

      {/* ── Settings Card ─────────────────────────────────────────────────── */}
      <div className="card mb-12">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 'var(--r-sm)',
            background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isDark ? <Moon size={15} style={{ color: 'var(--accent)' }} /> : <Sun size={15} style={{ color: 'var(--accent)' }} />}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>{t('settings')}</div>
        </div>

        {/* Theme toggle row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 0', borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isDark
              ? <Moon size={16} style={{ color: 'var(--text-2)' }} />
              : <Sun size={16} style={{ color: 'var(--text-2)' }} />}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)' }}>{t('theme')}</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{isDark ? t('dark_mode') : t('light_mode')}</div>
            </div>
          </div>
          {/* Theme pill buttons */}
          <div style={{
            display: 'flex', background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)', padding: 3, gap: 3,
          }}>
            {[
              { key: 'dark',  icon: <Moon size={13} />,  label: t('dark_mode').split(' ')[0] },
              { key: 'light', icon: <Sun size={13} />,   label: t('light_mode').split(' ')[0] },
            ].map(({ key, icon, label }) => (
              <button key={key}
                onClick={() => { if (theme !== key) toggleTheme(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: theme === key ? 'var(--accent)' : 'transparent',
                  border: 'none', borderRadius: 6,
                  padding: '6px 10px',
                  color: theme === key ? '#fff' : 'var(--text-2)',
                  fontSize: 12, fontWeight: theme === key ? 700 : 500,
                  cursor: 'pointer', transition: 'all 0.18s ease',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Language toggle row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Languages size={16} style={{ color: 'var(--text-2)' }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)' }}>{t('language')}</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{lang === 'en' ? 'English' : 'हिंदी'}</div>
            </div>
          </div>
          {/* Language pill buttons */}
          <div style={{
            display: 'flex', background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)', padding: 3, gap: 3,
          }}>
            {[
              { key: 'en', label: 'EN' },
              { key: 'hi', label: 'हि' },
            ].map(({ key, label }) => (
              <button key={key}
                onClick={() => setLang(key)}
                style={{
                  background: lang === key ? 'var(--accent)' : 'transparent',
                  border: 'none', borderRadius: 6,
                  padding: '6px 14px',
                  color: lang === key ? '#fff' : 'var(--text-2)',
                  fontSize: 13, fontWeight: lang === key ? 700 : 500,
                  cursor: 'pointer', transition: 'all 0.18s ease',
                  fontFamily: 'var(--font-sans)',
                  minWidth: 44,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ring Tone Selector */}
      <div className="card mb-12">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 30, height: 30, borderRadius: 'var(--r-sm)', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Volume2 size={15} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Order Alert Sound</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12 }}>
          Nayi order aane par kaun sa sound bajega — apni marzi se chunein
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RING_TONES.map(tone => (
            <div
              key={tone.id}
              onClick={() => { setSelectedTone(tone.id); setSelectedToneState(tone.id); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: 10,
                border: selectedTone === tone.id
                  ? '1.5px solid var(--accent)'
                  : '1px solid var(--border)',
                background: selectedTone === tone.id ? 'var(--accent-dim)' : 'var(--bg-2)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{tone.emoji}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: selectedTone === tone.id ? 'var(--accent)' : 'var(--text-0)' }}>
                    {tone.label}
                  </div>
                  {selectedTone === tone.id && (
                    <div style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                      ✓ Selected
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); previewTone(tone.id); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-1)',
                  color: 'var(--text-1)',
                  fontSize: 11, fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <Play size={10} /> Preview
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <button className="btn btn-danger" style={{ width: '100%', marginTop: 4 }} onClick={logout}>
        {t('sign_out')}
      </button>

      {/* Modals */}
      {modal === 'profile' && <ProfileEditModal uid={user.uid} riderData={rd} onClose={() => setModal(null)} onSave={fetchRider} />}
      {modal === 'vehicle' && <VehicleModal uid={user.uid} onClose={() => setModal(null)} onSave={fetchRider} />}
      {modal === 'kyc' && <KycModal uid={user.uid} onClose={() => setModal(null)} onSave={fetchRider} />}
      {modal === 'bank' && <BankAccountModal uid={user.uid} riderData={rd} onClose={() => setModal(null)} onSave={fetchRider} />}
    </div>
  );
}