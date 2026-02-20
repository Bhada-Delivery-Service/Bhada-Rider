import React, { useState, useEffect } from 'react';
import { User, Car, FileText, Send, CheckCircle, RefreshCw, LogOut, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { ridersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ─── Modals ─────────────────────────────────────────────────────────────── */

function ProfileModal({ riderData, uid, onClose, onSave }) {
  const [form, setForm] = useState({
    firstName: riderData?.firstName || '',
    lastName: riderData?.lastName || '',
    email: riderData?.email || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.firstName.trim()) { toast.error('First name is required'); return; }
    setLoading(true);
    try {
      await ridersAPI.updateProfile(uid, form);
      toast.success('Profile saved!');
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
          <div className="modal-title">Personal Details</div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="form-group">
          <label className="form-label">First Name *</label>
          <input className="form-input" value={form.firstName}
            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} autoFocus />
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
          <button className="btn btn-primary flex-1" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function VehicleModal({ uid, onClose, onSave }) {
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
          <div className="modal-title">Vehicle Details</div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="form-group">
          <label className="form-label">Vehicle Type</label>
          <select className="form-select" value={form.vehicleType}
            onChange={e => setForm(f => ({ ...f, vehicleType: e.target.value }))}>
            <option value="BIKE">Bike</option>
            <option value="SCOOTER">Scooter</option>
            <option value="CYCLE">Cycle</option>
            <option value="CAR">Car</option>
            <option value="VAN">Van</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Vehicle Number</label>
          <input className="form-input" placeholder="e.g. MH01AB1234" value={form.vehicleNumber}
            onChange={e => setForm(f => ({ ...f, vehicleNumber: e.target.value.toUpperCase() }))} />
        </div>
        <div className="flex gap-8">
          <button className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary flex-1" onClick={handleSave} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
}

function KycModal({ uid, onClose, onSave }) {
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
          <div className="modal-title">KYC Documents</div>
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
          <label className="form-label">ID Number</label>
          <input className="form-input" placeholder="Enter your ID number" value={form.idProofNumber}
            onChange={e => setForm(f => ({ ...f, idProofNumber: e.target.value.toUpperCase() }))} />
        </div>
        <div style={{ padding: '10px 12px', background: 'var(--blue-dim)', borderRadius: 8, fontSize: 12, color: 'var(--blue)', marginBottom: 16 }}>
          ℹ️ Documents are verified by admin within 24–48 hours.
        </div>
        <div className="flex gap-8">
          <button className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary flex-1" onClick={handleSave} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit KYC'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */

export default function OnboardingGatePage() {
  const { user, logout, updateRider, refreshOnboardingStatus, onboardingStatus } = useAuth();
  const [riderData, setRiderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState(null);

  const fetchRider = async (silent = false) => {
    if (!user?.uid) return;
    if (!silent) setLoading(true);
    try {
      const { data } = await ridersAPI.getById(user.uid);
      const rd = data?.data || data;
      setRiderData(rd);
      updateRider(rd);
    } catch (err) {
      // 404 = new rider, no profile yet → show empty onboarding form normally
      if (err.response?.status === 404) {
        setRiderData(null);
      } else {
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRider(); }, [user?.uid]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshOnboardingStatus();
    await fetchRider(true);
    setRefreshing(false);
    toast.success('Status refreshed');
  };

  const submitOnboarding = async () => {
    try {
      await ridersAPI.submitOnboarding(user.uid);
      toast.success('Application submitted! Waiting for admin approval.');
      await fetchRider(true);
      await refreshOnboardingStatus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)', display: 'grid', placeItems: 'center' }}>
      <div className="loader" />
    </div>
  );

  const rd = riderData;
  const hasProfile = !!(rd?.firstName);
  const hasVehicle = !!(rd?.vehicleType && rd?.vehicleNumber);
  const kycStatus = rd?.kycStatus || 'NOT_SUBMITTED';
  const obStatus = onboardingStatus || rd?.onboardingStatus || 'NOT_SUBMITTED';

  const steps = [
    {
      id: 'profile',
      icon: User,
      title: 'Personal Details',
      desc: 'Your name and contact information',
      done: hasProfile,
      action: () => setModal('profile'),
      actionLabel: 'Complete Profile',
      canAct: true,
    },
    {
      id: 'vehicle',
      icon: Car,
      title: 'Vehicle Details',
      desc: 'Vehicle type and registration number',
      done: hasVehicle,
      action: () => setModal('vehicle'),
      actionLabel: 'Add Vehicle',
      canAct: hasProfile,
    },
    {
      id: 'kyc',
      icon: FileText,
      title: 'KYC Verification',
      desc: 'Government-issued ID document',
      done: kycStatus === 'APPROVED',
      pending: kycStatus === 'PENDING',
      action: () => setModal('kyc'),
      actionLabel: kycStatus === 'REJECTED' ? 'Resubmit KYC' : 'Submit KYC',
      canAct: hasVehicle && kycStatus !== 'APPROVED' && kycStatus !== 'PENDING',
    },
    {
      id: 'onboarding',
      icon: Send,
      title: 'Submit Application',
      desc: 'Send your application for admin review',
      done: obStatus === 'APPROVED',
      pending: obStatus === 'PENDING',
      action: submitOnboarding,
      actionLabel: obStatus === 'REJECTED' ? 'Resubmit Application' : 'Submit Application',
      canAct: kycStatus === 'APPROVED' && (obStatus === 'NOT_SUBMITTED' || obStatus === 'REJECTED'),
    },
  ];

  const completedCount = steps.filter(s => s.done).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: 'var(--bg-1)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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

      {/* Content */}
      <div style={{ flex: 1, padding: '24px 16px', maxWidth: 480, margin: '0 auto', width: '100%' }}>

        {/* Welcome */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Welcome{rd?.firstName ? `, ${rd.firstName}` : ''}! 👋
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
            Complete the steps below to start delivering with Bhada.
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
              height: '100%', width: `${progress}%`,
              background: 'var(--accent)', borderRadius: 99,
              transition: 'width 0.4s ease',
              boxShadow: '0 0 10px var(--accent-glow)',
            }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 6 }}>
            {completedCount} of {steps.length} steps completed
          </div>
        </div>

        {/* Status banners */}
        {obStatus === 'PENDING' && (
          <div style={{
            padding: '14px 16px', marginBottom: 20,
            background: 'var(--orange-dim)', border: '1px solid rgba(255,154,60,0.2)',
            borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <div style={{ fontSize: 20, flexShrink: 0 }}>⏳</div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--orange)', marginBottom: 3 }}>Application Under Review</div>
              <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.5 }}>
                Your application has been submitted. Admin will review it within 24–48 hours. Tap below to check for updates.
              </div>
              <button
                className="btn btn-sm"
                style={{ marginTop: 10, background: 'var(--orange-dim)', color: 'var(--orange)', border: '1px solid rgba(255,154,60,0.3)' }}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw size={12} style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }} />
                {refreshing ? 'Checking...' : 'Check Status'}
              </button>
            </div>
          </div>
        )}

        {obStatus === 'REJECTED' && (
          <div style={{
            padding: '14px 16px', marginBottom: 20,
            background: 'var(--red-dim)', border: '1px solid rgba(255,77,109,0.2)',
            borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <div style={{ fontSize: 20, flexShrink: 0 }}>✗</div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--red)', marginBottom: 3 }}>Application Rejected</div>
              <div style={{ fontSize: 12, color: 'var(--text-1)' }}>
                Your application was rejected. Please update your details and resubmit below.
              </div>
            </div>
          </div>
        )}

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {steps.map((step) => {
            const Icon = step.icon;
            const state = step.done ? 'done'
              : step.pending ? 'pending-review'
              : step.canAct ? 'active'
              : 'locked';

            return (
              <div key={step.id} style={{
                background: 'var(--bg-1)',
                border: `1px solid ${
                  state === 'active' ? 'rgba(0,229,160,0.25)'
                  : state === 'done' ? 'rgba(54,211,153,0.15)'
                  : 'var(--border)'
                }`,
                borderRadius: 12,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                opacity: state === 'locked' ? 0.5 : 1,
                transition: 'all 0.2s ease',
              }}>
                {/* Step icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  display: 'grid', placeItems: 'center',
                  background: state === 'done' ? 'var(--green-dim)'
                    : state === 'active' ? 'var(--accent-dim)'
                    : state === 'pending-review' ? 'var(--orange-dim)'
                    : 'var(--bg-3)',
                  color: state === 'done' ? 'var(--green)'
                    : state === 'active' ? 'var(--accent)'
                    : state === 'pending-review' ? 'var(--orange)'
                    : 'var(--text-2)',
                }}>
                  {state === 'done' ? <CheckCircle size={18} /> : <Icon size={18} />}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: state === 'locked' ? 'var(--text-2)' : 'var(--text-0)', marginBottom: 2 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                    {step.pending
                      ? <span style={{ color: 'var(--orange)' }}>⏳ Under admin review</span>
                      : step.done
                      ? <span style={{ color: 'var(--green)' }}>✓ Completed</span>
                      : step.desc}
                  </div>
                </div>

                {/* CTA */}
                {!step.done && !step.pending && step.canAct && (
                  <button className="btn btn-primary btn-sm" style={{ flexShrink: 0, fontSize: 12 }} onClick={step.action}>
                    {step.actionLabel}
                  </button>
                )}
                {state === 'locked' && (
                  <div style={{ fontSize: 18, flexShrink: 0 }}>🔒</div>
                )}
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
        <VehicleModal uid={user.uid} onClose={() => setModal(null)} onSave={() => fetchRider(true)} />
      )}
      {modal === 'kyc' && (
        <KycModal uid={user.uid} onClose={() => setModal(null)} onSave={() => fetchRider(true)} />
      )}
    </div>
  );
}
