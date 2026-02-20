import React, { useState, useEffect } from 'react';
import { User, Car, FileText, Send, CheckCircle, Clock, XCircle, RefreshCw, ChevronRight, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { ridersAPI, filesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
          <div className="modal-title">Edit Profile</div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="form-group">
          <label className="form-label">First Name</label>
          <input className="form-input" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input className="form-input" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
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

function VehicleModal({ onClose, onSave, uid }) {
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
          <select className="form-select" value={form.vehicleType} onChange={e => setForm(f => ({ ...f, vehicleType: e.target.value }))}>
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

function KycModal({ onClose, onSave, uid }) {
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
          <select className="form-select" value={form.idProofType} onChange={e => setForm(f => ({ ...f, idProofType: e.target.value }))}>
            <option value="AADHAR">Aadhaar Card</option>
            <option value="PAN">PAN Card</option>
            
            <option value="DRIVING_LICENCE">Driving Licence</option>
            
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">ID Number</label>
          <input className="form-input" placeholder="Enter ID number" value={form.idProofNumber}
            onChange={e => setForm(f => ({ ...f, idProofNumber: e.target.value.toUpperCase() }))} />
        </div>
        <div style={{ padding: '10px 12px', background: 'var(--blue-dim)', borderRadius: 8, fontSize: 12, color: 'var(--blue)', marginBottom: 16 }}>
          ℹ️ Documents are reviewed by admin and verified within 24–48 hours.
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

export default function ProfilePage() {
  const { user, logout, updateRider } = useAuth();
  const [riderData, setRiderData] = useState(null);
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
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
    { id: 'profile', title: 'Personal Profile', desc: 'Name, email, and contact info', done: !!(rd?.firstName) },
    { id: 'vehicle', title: 'Vehicle Details', desc: 'Vehicle type and registration number', done: hasVehicle },
    { id: 'kyc', title: 'KYC Documents', desc: 'Government ID verification', done: kycStatus === 'APPROVED' },
    { id: 'onboarding', title: 'Onboarding Application', desc: 'Submit for admin review and approval', done: obStatus === 'APPROVED' },
  ];

  const currentStep = steps.findIndex(s => !s.done);

  const kycBadge = {
    APPROVED: <span className="badge green">✓ Verified</span>,
    PENDING: <span className="badge orange">⏳ Under Review</span>,
    REJECTED: <span className="badge red">✗ Rejected</span>,
    NOT_SUBMITTED: <span className="badge neutral">Not Submitted</span>,
  }[kycStatus] || <span className="badge neutral">{kycStatus}</span>;

  const obBadge = {
    APPROVED: <span className="badge green">✓ Approved</span>,
    PENDING: <span className="badge orange">⏳ Pending Review</span>,
    REJECTED: <span className="badge red">✗ Rejected</span>,
    NOT_SUBMITTED: <span className="badge neutral">Not Submitted</span>,
  }[obStatus] || <span className="badge neutral">{obStatus}</span>;

  return (
    <div>
      <div className="flex items-center justify-between mb-16">
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Profile</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Manage your rider account</div>
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
            <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase' }}>KYC Status</div>
            {kycBadge}
          </div>
          <div style={{ padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase' }}>Onboarding</div>
            {obBadge}
          </div>
          {rd?.vehicleType && (
            <div style={{ padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase' }}>Vehicle</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)' }}>{rd.vehicleType}</div>
            </div>
          )}
          {rd?.vehicleNumber && (
            <div style={{ padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase' }}>Reg. Number</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)', fontFamily: 'var(--font-mono)' }}>{rd.vehicleNumber}</div>
            </div>
          )}
        </div>
      </div>

      {/* Onboarding steps */}
      {obStatus !== 'APPROVED' && (
        <div className="card mb-12">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            🚀 Complete Setup
          </div>
          <StepIndicator steps={steps} current={currentStep === -1 ? steps.length : currentStep} />

          {/* Action buttons */}
          <div className="divider" />
          <div className="flex flex-col gap-8">
            {!rd?.firstName && (
              <button className="btn btn-secondary" onClick={() => setModal('profile')}>
                <User size={14} /> Complete Profile
              </button>
            )}
            {rd?.firstName && !hasVehicle && (
              <button className="btn btn-secondary" onClick={() => setModal('vehicle')}>
                <Car size={14} /> Add Vehicle Details
              </button>
            )}
            {hasVehicle && kycStatus === 'NOT_SUBMITTED' && (
              <button className="btn btn-secondary" onClick={() => setModal('kyc')}>
                <FileText size={14} /> Submit KYC
              </button>
            )}
            {kycStatus === 'APPROVED' && obStatus === 'NOT_SUBMITTED' && (
              <button className="btn btn-primary" onClick={submitOnboarding}>
                <Send size={14} /> Submit Onboarding Application
              </button>
            )}
            {obStatus === 'PENDING' && (
              <div style={{ padding: '12px', background: 'var(--orange-dim)', borderRadius: 8, fontSize: 13, color: 'var(--orange)' }}>
                ⏳ Your application is under review. We'll notify you once approved.
              </div>
            )}
            {obStatus === 'REJECTED' && (
              <div style={{ padding: '12px', background: 'var(--red-dim)', borderRadius: 8, fontSize: 13, color: 'var(--red)' }}>
                ✗ Application rejected. Please update your details and resubmit.
                <button className="btn btn-danger btn-sm" style={{ marginTop: 10, width: '100%' }} onClick={submitOnboarding}>
                  Resubmit Application
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
              <div style={{ fontWeight: 600, color: 'var(--green)' }}>Fully Onboarded!</div>
              <div style={{ fontSize: 12, color: 'var(--text-1)' }}>You're approved to accept and deliver orders.</div>
            </div>
          </div>
        </div>
      )}

      {/* Sign out */}
      <button className="btn btn-danger" style={{ width: '100%', marginTop: 4 }} onClick={logout}>
        Sign Out
      </button>

      {/* Modals */}
      {modal === 'profile' && <ProfileEditModal uid={user.uid} riderData={rd} onClose={() => setModal(null)} onSave={fetchRider} />}
      {modal === 'vehicle' && <VehicleModal uid={user.uid} onClose={() => setModal(null)} onSave={fetchRider} />}
      {modal === 'kyc' && <KycModal uid={user.uid} onClose={() => setModal(null)} onSave={fetchRider} />}
    </div>
  );
}
