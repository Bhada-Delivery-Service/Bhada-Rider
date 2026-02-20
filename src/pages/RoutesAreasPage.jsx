import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, RefreshCw, X, Route } from 'lucide-react';
import toast from 'react-hot-toast';
import { ridersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function AddModal({ title, fields, onClose, onSave, loading }) {
  const [form, setForm] = useState(Object.fromEntries(fields.map(f => [f.key, f.default || ''])));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        {fields.map(f => (
          <div key={f.key} className="form-group">
            <label className="form-label">{f.label}</label>
            {f.type === 'select' ? (
              <select className="form-select" value={form[f.key]} onChange={e => setForm(s => ({ ...s, [f.key]: e.target.value }))}>
                {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <input className="form-input" type={f.type || 'text'} placeholder={f.placeholder}
                value={form[f.key]} onChange={e => setForm(s => ({ ...s, [f.key]: e.target.value }))} />
            )}
          </div>
        ))}
        <div className="flex gap-8">
          <button className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary flex-1" disabled={loading} onClick={() => onSave(form)}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RoutesAreasPage() {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [tab, setTab] = useState('routes');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const fetchData = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const [rRes, aRes] = await Promise.allSettled([
        ridersAPI.getRoutes(user.uid),
        ridersAPI.getAreas(user.uid),
      ]);
      if (rRes.status === 'fulfilled') setRoutes(rRes.value.data?.data || []);
      if (aRes.status === 'fulfilled') setAreas(aRes.value.data?.data || []);
    } catch (_) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [user?.uid]);

  const addRoute = async (form) => {
    setActionLoading(true);
    try {
      await ridersAPI.addRoute(user.uid, {
        from: form.from,
        to: form.to,
        vehicleType: form.vehicleType,
      });
      toast.success('Route added!');
      setModal(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add route');
    } finally { setActionLoading(false); }
  };

  const deleteRoute = async (routeId) => {
    if (!window.confirm('Delete this route?')) return;
    try {
      await ridersAPI.deleteRoute(user.uid, routeId);
      toast.success('Route deleted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const addArea = async (form) => {
    setActionLoading(true);
    try {
      await ridersAPI.addArea(user.uid, {
        name: form.name,
        pincode: form.pincode,
        city: form.city,
      });
      toast.success('Area added!');
      setModal(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add area');
    } finally { setActionLoading(false); }
  };

  const deleteArea = async (areaId) => {
    if (!window.confirm('Delete this area?')) return;
    try {
      await ridersAPI.deleteArea(user.uid, areaId);
      toast.success('Area deleted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const routeFields = [
    { key: 'from', label: 'From (Origin)', placeholder: 'e.g. Andheri West' },
    { key: 'to', label: 'To (Destination)', placeholder: 'e.g. Bandra East' },
    {
      key: 'vehicleType', label: 'Vehicle Type', type: 'select',
      default: 'BIKE',
      options: [
        { value: 'BIKE', label: 'Bike' },
        { value: 'SCOOTER', label: 'Scooter' },
        { value: 'CYCLE', label: 'Cycle' },
        { value: 'CAR', label: 'Car' },
        { value: 'VAN', label: 'Van' },
      ],
    },
  ];

  const areaFields = [
    { key: 'name', label: 'Area Name', placeholder: 'e.g. Andheri West' },
    { key: 'pincode', label: 'Pincode', placeholder: 'e.g. 400058' },
    { key: 'city', label: 'City', placeholder: 'e.g. Mumbai' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-16">
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Routes & Areas</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Set your delivery coverage</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchData} style={{ padding: 8 }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, background: 'var(--bg-2)', padding: 4, borderRadius: 10 }}>
        {['routes', 'areas'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              background: tab === t ? 'var(--bg-1)' : 'transparent',
              color: tab === t ? 'var(--accent)' : 'var(--text-2)',
              transition: 'all 0.15s ease',
            }}>
            {t === 'routes' ? '🛣 Routes' : '📍 Areas'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-center"><div className="loader" /></div>
      ) : tab === 'routes' ? (
        <>
          <button className="btn btn-primary btn-sm" style={{ width: '100%', marginBottom: 16 }} onClick={() => setModal('route')}>
            <Plus size={14} /> Add Route
          </button>
          {routes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Route size={20} /></div>
              <h3>No routes yet</h3>
              <p>Add routes you regularly deliver on</p>
            </div>
          ) : routes.map(route => (
            <div key={route.id || route.routeId} className="card" style={{ marginBottom: 10 }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-8 mb-4">
                    <span className="badge neutral">{route.vehicleType}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)' }}>
                    {route.from} → {route.to}
                  </div>
                </div>
                <button className="btn btn-danger btn-sm" style={{ padding: 8 }}
                  onClick={() => deleteRoute(route.id || route.routeId)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <button className="btn btn-primary btn-sm" style={{ width: '100%', marginBottom: 16 }} onClick={() => setModal('area')}>
            <Plus size={14} /> Add Area
          </button>
          {areas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><MapPin size={20} /></div>
              <h3>No areas yet</h3>
              <p>Add areas you're available to deliver in</p>
            </div>
          ) : areas.map(area => (
            <div key={area.id || area.areaId} className="card" style={{ marginBottom: 10 }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)' }}>{area.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                    {area.city} — <span className="font-mono">{area.pincode}</span>
                  </div>
                </div>
                <button className="btn btn-danger btn-sm" style={{ padding: 8 }}
                  onClick={() => deleteArea(area.id || area.areaId)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {modal === 'route' && (
        <AddModal title="Add Route" fields={routeFields} loading={actionLoading}
          onClose={() => setModal(null)} onSave={addRoute} />
      )}
      {modal === 'area' && (
        <AddModal title="Add Delivery Area" fields={areaFields} loading={actionLoading}
          onClose={() => setModal(null)} onSave={addArea} />
      )}
    </div>
  );
}
