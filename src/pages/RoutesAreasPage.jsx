import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin, Plus, Trash2, RefreshCw, X, Route, Navigation,
  Circle, CheckCircle, Crosshair, ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ridersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ─── Google Maps loader (no external npm required) ─────────────────────── */
let mapsLoaded = false;
let mapsLoading = false;
const mapsCallbacks = [];

function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (mapsLoaded) { resolve(window.google); return; }
    mapsCallbacks.push({ resolve, reject });
    if (mapsLoading) return;
    mapsLoading = true;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.onload = () => {
      mapsLoaded = true;
      mapsLoading = false;
      mapsCallbacks.forEach(cb => cb.resolve(window.google));
      mapsCallbacks.length = 0;
    };
    script.onerror = (e) => {
      mapsLoading = false;
      mapsCallbacks.forEach(cb => cb.reject(e));
      mapsCallbacks.length = 0;
    };
    document.head.appendChild(script);
  });
}

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

/* ─── Default center: Mumbai ─────────────────────────────────────────────── */
const DEFAULT_CENTER = { lat: 19.0760, lng: 72.8777 };

/* ─── Map styles (dark theme) ──────────────────────────────────────────── */
const DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0d1220' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1220' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#5a6785' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a2235' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#131929' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1a2235' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#05080f' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4d9fff' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#9ba8c4' }] },
];

/* ─── Route Map Modal ────────────────────────────────────────────────────── */
function RouteMapModal({ onClose, onSave, loading, riderData }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const [mapsReady, setMapsReady] = useState(mapsLoaded);
  const [step, setStep] = useState('start'); // 'start' | 'end' | 'confirm'
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [routeName, setRouteName] = useState('');
  const [threshold1, setThreshold1] = useState(500);
  const [threshold2, setThreshold2] = useState(1000);
  const [threshold3, setThreshold3] = useState(2000);
  const [locating, setLocating] = useState(false);
  const geocoder = useRef(null);

  /* Load maps */
  useEffect(() => {
    if (!MAPS_API_KEY) return;
    loadGoogleMaps(MAPS_API_KEY)
      .then(() => setMapsReady(true))
      .catch(() => toast.error('Failed to load Google Maps'));
  }, []);

  /* Init map */
  useEffect(() => {
    if (!mapsReady || !mapRef.current || mapInstance.current) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: 13,
      styles: DARK_STYLE,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'greedy',
    });
    mapInstance.current = map;
    geocoder.current = new window.google.maps.Geocoder();

    // Click handler — alternate between start/end
    map.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      reverseGeocode(lat, lng, (label) => {
        setStep(prev => {
          if (prev === 'start') {
            placeMarker(lat, lng, 'start', label);
            setStartPoint({ lat, lng, label });
            return 'end';
          } else if (prev === 'end') {
            placeMarker(lat, lng, 'end', label);
            setEndPoint({ lat, lng, label });
            return 'confirm';
          }
          return prev;
        });
      });
    });

    // Try to center on rider's location
    getCurrentLocation(map);
  }, [mapsReady]);

  /* Draw polyline when both points set */
  useEffect(() => {
    if (!mapInstance.current || !startPoint || !endPoint) return;
    if (polylineRef.current) polylineRef.current.setMap(null);
    polylineRef.current = new window.google.maps.Polyline({
      path: [startPoint, endPoint],
      strokeColor: '#00e5a0',
      strokeOpacity: 0.9,
      strokeWeight: 3,
      map: mapInstance.current,
    });
    // Fit bounds
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(startPoint);
    bounds.extend(endPoint);
    mapInstance.current.fitBounds(bounds, 60);
  }, [startPoint, endPoint]);

  const reverseGeocode = (lat, lng, cb) => {
    if (!geocoder.current) { cb(`${lat.toFixed(4)}, ${lng.toFixed(4)}`); return; }
    geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const parts = results[0].address_components;
        const locality = parts.find(p => p.types.includes('sublocality') || p.types.includes('locality'));
        cb(locality?.long_name || results[0].formatted_address.split(',')[0]);
      } else {
        cb(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    });
  };

  const getCurrentLocation = (map) => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.setCenter(center);
        map.setZoom(15);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const placeMarker = (lat, lng, type, label) => {
    // Remove previous marker of same type
    markersRef.current = markersRef.current.filter(m => {
      if (m._type === type) { m.setMap(null); return false; }
      return true;
    });

    const isStart = type === 'start';
    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstance.current,
      title: label,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: isStart ? '#00e5a0' : '#ff4d6d',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      },
    });
    marker._type = type;

    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div style="color:#0d1220;font-size:12px;font-weight:600;">${isStart ? '🟢 Start' : '🔴 End'}: ${label}</div>`,
    });
    marker.addListener('click', () => infoWindow.open(mapInstance.current, marker));

    markersRef.current.push(marker);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstance.current) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        mapInstance.current.setCenter(center);
        mapInstance.current.setZoom(15);
        setLocating(false);
      },
      () => { setLocating(false); toast.error('Location access denied'); },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const resetPoints = () => {
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    if (polylineRef.current) { polylineRef.current.setMap(null); polylineRef.current = null; }
    setStartPoint(null);
    setEndPoint(null);
    setStep('start');
  };

  const handleSave = () => {
    if (!startPoint || !endPoint) { toast.error('Set both start and end points'); return; }
    if (!routeName.trim()) { toast.error('Enter a route name'); return; }
    onSave({
      routeName: routeName.trim(),
      node1: { latitude: startPoint.lat, longitude: startPoint.lng, label: startPoint.label },
      node2: { latitude: endPoint.lat, longitude: endPoint.lng, label: endPoint.label },
      threshold1: Number(threshold1),
      threshold2: Number(threshold2),
      threshold3: Number(threshold3),
    });
  };

  const stepMsg = {
    start: '📍 Tap on the map to set the START point of your route',
    end: '🔴 Now tap to set the END point of your route',
    confirm: '✅ Route set! Enter a name and save.',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(5,8,15,0.95)', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', background: 'var(--bg-1)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Add Route</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{stepMsg[step]}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-1)', cursor: 'pointer', padding: 4 }}>
          <X size={18} />
        </button>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        {!MAPS_API_KEY ? (
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg-2)' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-2)', padding: 20 }}>
              <MapPin size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Google Maps API key not set</div>
              <div style={{ fontSize: 12 }}>Add VITE_GOOGLE_MAPS_API_KEY to your .env file</div>
            </div>
          </div>
        ) : !mapsReady ? (
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg-2)' }}>
            <div className="loader" />
          </div>
        ) : (
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        )}

        {/* Locate me button */}
        {mapsReady && (
          <button onClick={handleLocateMe} disabled={locating} style={{
            position: 'absolute', bottom: 16, right: 16,
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--bg-1)', border: '1px solid var(--border-bright)',
            color: locating ? 'var(--text-2)' : 'var(--accent)',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}>
            <Crosshair size={18} style={{ animation: locating ? 'ksp 1s linear infinite' : 'none' }} />
          </button>
        )}

        {/* Legend */}
        {mapsReady && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(13,18,32,0.9)', border: '1px solid var(--border-bright)',
            borderRadius: 8, padding: '8px 12px', fontSize: 11,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e5a0', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-1)' }}>Start</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4d6d', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-1)' }}>End</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom panel */}
      <div style={{
        background: 'var(--bg-1)', borderTop: '1px solid var(--border)',
        padding: '16px', flexShrink: 0,
        maxHeight: '45vh', overflowY: 'auto',
      }}>
        {/* Start/End labels */}
        {(startPoint || endPoint) && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <div style={{
              flex: 1, padding: '8px 12px', background: startPoint ? 'var(--accent-dim)' : 'var(--bg-3)',
              borderRadius: 8, border: `1px solid ${startPoint ? 'rgba(0,229,160,0.3)' : 'var(--border)'}`,
              fontSize: 12,
            }}>
              <div style={{ fontSize: 10, color: 'var(--text-2)', marginBottom: 2 }}>START</div>
              <div style={{ color: startPoint ? 'var(--accent)' : 'var(--text-2)', fontWeight: 600 }}>
                {startPoint?.label || 'Not set'}
              </div>
            </div>
            <ChevronRight size={16} style={{ alignSelf: 'center', color: 'var(--text-2)', flexShrink: 0 }} />
            <div style={{
              flex: 1, padding: '8px 12px',
              background: endPoint ? 'rgba(255,77,109,0.1)' : 'var(--bg-3)',
              borderRadius: 8, border: `1px solid ${endPoint ? 'rgba(255,77,109,0.3)' : 'var(--border)'}`,
              fontSize: 12,
            }}>
              <div style={{ fontSize: 10, color: 'var(--text-2)', marginBottom: 2 }}>END</div>
              <div style={{ color: endPoint ? '#ff4d6d' : 'var(--text-2)', fontWeight: 600 }}>
                {endPoint?.label || 'Not set'}
              </div>
            </div>
          </div>
        )}

        {/* Route name */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
            Route Name *
          </label>
          <input
            className="form-input"
            placeholder="e.g. Andheri → Bandra"
            value={routeName}
            onChange={e => setRouteName(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Threshold inputs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'Near (m)', val: threshold1, set: setThreshold1 },
            { label: 'Mid (m)', val: threshold2, set: setThreshold2 },
            { label: 'Far (m)', val: threshold3, set: setThreshold3 },
          ].map(({ label, val, set }) => (
            <div key={label} style={{ flex: 1 }}>
              <label style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                {label}
              </label>
              <input
                className="form-input"
                type="number"
                value={val}
                onChange={e => set(Number(e.target.value))}
                style={{ width: '100%', padding: '6px 8px', fontSize: 12 }}
              />
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(startPoint || endPoint) && (
            <button className="btn btn-secondary btn-sm" onClick={resetPoints} style={{ flexShrink: 0 }}>
              Reset
            </button>
          )}
          <button
            className="btn btn-secondary flex-1"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary flex-1"
            onClick={handleSave}
            disabled={loading || !startPoint || !endPoint || !routeName.trim()}
          >
            {loading ? 'Saving…' : <><CheckCircle size={13} /> Save Route</>}
          </button>
        </div>
      </div>

      <style>{`@keyframes ksp{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ─── Area Map Modal ─────────────────────────────────────────────────────── */
function AreaMapModal({ onClose, onSave, loading }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const geocoder = useRef(null);
  const [mapsReady, setMapsReady] = useState(mapsLoaded);
  const [center, setCenter] = useState(null);
  const [areaName, setAreaName] = useState('');
  const [radius, setRadius] = useState(3000);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!MAPS_API_KEY) return;
    loadGoogleMaps(MAPS_API_KEY)
      .then(() => setMapsReady(true))
      .catch(() => toast.error('Failed to load Google Maps'));
  }, []);

  useEffect(() => {
    if (!mapsReady || !mapRef.current || mapInstance.current) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: 13,
      styles: DARK_STYLE,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'greedy',
    });
    mapInstance.current = map;
    geocoder.current = new window.google.maps.Geocoder();

    map.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      reverseGeocode(lat, lng, (label) => {
        setCenter({ lat, lng, label });
        placeMarkerAndCircle(map, lat, lng, radius);
        if (!areaName) setAreaName(label);
      });
    });

    getCurrentLocation(map);
  }, [mapsReady]);

  /* Update circle when radius changes */
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setRadius(radius);
    }
  }, [radius]);

  const reverseGeocode = (lat, lng, cb) => {
    if (!geocoder.current) { cb(`${lat.toFixed(4)}, ${lng.toFixed(4)}`); return; }
    geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const parts = results[0].address_components;
        const locality = parts.find(p => p.types.includes('sublocality') || p.types.includes('locality'));
        cb(locality?.long_name || results[0].formatted_address.split(',')[0]);
      } else {
        cb(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    });
  };

  const getCurrentLocation = (map) => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => { map.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }); map.setZoom(14); },
      () => {},
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const placeMarkerAndCircle = (map, lat, lng, r) => {
    if (markerRef.current) markerRef.current.setMap(null);
    if (circleRef.current) circleRef.current.setMap(null);

    markerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#4d9fff',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      },
    });

    circleRef.current = new window.google.maps.Circle({
      center: { lat, lng },
      radius: r,
      strokeColor: '#4d9fff',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#4d9fff',
      fillOpacity: 0.1,
      map,
    });

    // Fit to circle
    map.fitBounds(circleRef.current.getBounds(), 40);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstance.current) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapInstance.current.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        mapInstance.current.setZoom(14);
        setLocating(false);
      },
      () => { setLocating(false); toast.error('Location access denied'); },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSave = () => {
    if (!center) { toast.error('Tap on the map to set your area center'); return; }
    if (!areaName.trim()) { toast.error('Enter an area name'); return; }
    onSave({
      areaName: areaName.trim(),
      node: { latitude: center.lat, longitude: center.lng, label: center.label },
      threshold: radius,
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(5,8,15,0.95)', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', background: 'var(--bg-1)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Add Delivery Area</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
            {center ? '✅ Area set! Adjust radius and save.' : '📍 Tap on the map to set your coverage area'}
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-1)', cursor: 'pointer', padding: 4 }}>
          <X size={18} />
        </button>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        {!MAPS_API_KEY ? (
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg-2)' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-2)', padding: 20 }}>
              <MapPin size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Google Maps API key not set</div>
              <div style={{ fontSize: 12 }}>Add VITE_GOOGLE_MAPS_API_KEY to your .env file</div>
            </div>
          </div>
        ) : !mapsReady ? (
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg-2)' }}>
            <div className="loader" />
          </div>
        ) : (
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        )}

        {/* Locate me */}
        {mapsReady && (
          <button onClick={handleLocateMe} disabled={locating} style={{
            position: 'absolute', bottom: 16, right: 16,
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--bg-1)', border: '1px solid var(--border-bright)',
            color: locating ? 'var(--text-2)' : 'var(--blue)',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}>
            <Crosshair size={18} style={{ animation: locating ? 'ksp 1s linear infinite' : 'none' }} />
          </button>
        )}

        {/* Blue circle legend */}
        {mapsReady && center && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(13,18,32,0.9)', border: '1px solid var(--border-bright)',
            borderRadius: 8, padding: '8px 12px', fontSize: 11,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4d9fff', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-1)' }}>{center.label}</span>
            </div>
            <div style={{ color: 'var(--text-2)', marginTop: 2 }}>{(radius / 1000).toFixed(1)} km radius</div>
          </div>
        )}
      </div>

      {/* Bottom panel */}
      <div style={{
        background: 'var(--bg-1)', borderTop: '1px solid var(--border)',
        padding: '16px', flexShrink: 0,
      }}>
        {center && (
          <div style={{
            padding: '10px 12px', background: 'var(--blue-dim)',
            border: '1px solid rgba(77,159,255,0.25)', borderRadius: 8,
            marginBottom: 12, fontSize: 12,
          }}>
            <div style={{ fontWeight: 600, color: 'var(--blue)', marginBottom: 2 }}>📍 Center</div>
            <div style={{ color: 'var(--text-1)' }}>{center.label}</div>
            <div style={{ color: 'var(--text-2)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
              {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
            </div>
          </div>
        )}

        {/* Area name */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
            Area Name *
          </label>
          <input
            className="form-input"
            placeholder="e.g. Andheri West"
            value={areaName}
            onChange={e => setAreaName(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Radius slider */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Radius
            </label>
            <span style={{ fontSize: 12, color: 'var(--blue)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {(radius / 1000).toFixed(1)} km
            </span>
          </div>
          <input
            type="range" min="500" max="20000" step="500"
            value={radius}
            onChange={e => setRadius(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--blue)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-2)' }}>
            <span>0.5 km</span><span>20 km</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary flex-1"
            onClick={handleSave}
            disabled={loading || !center || !areaName.trim()}
          >
            {loading ? 'Saving…' : <><CheckCircle size={13} /> Save Area</>}
          </button>
        </div>
      </div>

      <style>{`@keyframes ksp{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function RoutesAreasPage() {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [tab, setTab] = useState('routes');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [modal, setModal] = useState(null); // 'route' | 'area'

  const fetchData = useCallback(async () => {
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
  }, [user?.uid]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addRoute = async (form) => {
    setActionLoading(true);
    try {
      await ridersAPI.addRoute(user.uid, form);
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
      await ridersAPI.addArea(user.uid, form);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-16">
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Routes & Areas</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Set your delivery coverage on the map</div>
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
            <Plus size={14} /> Add Route on Map
          </button>
          {routes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Route size={20} /></div>
              <h3>No routes yet</h3>
              <p>Tap above to draw your route on the map</p>
            </div>
          ) : routes.map(route => {
            const n1 = route.node1 || {};
            const n2 = route.node2 || {};
            return (
              <div key={route.id || route.routeId} className="card" style={{ marginBottom: 10 }}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)', marginBottom: 4 }}>
                      {route.routeName || `${n1.label || '?'} → ${n2.label || '?'}`}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                      {n1.label || 'Start'}
                      <span style={{ color: 'var(--text-2)' }}>→</span>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff4d6d', display: 'inline-block' }} />
                      {n2.label || 'End'}
                    </div>
                    {route.threshold1 && (
                      <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>
                        Thresholds: {route.threshold1}m / {route.threshold2}m / {route.threshold3}m
                      </div>
                    )}
                  </div>
                  <button className="btn btn-danger btn-sm" style={{ padding: 8 }}
                    onClick={() => deleteRoute(route.id || route.routeId)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          <button className="btn btn-primary btn-sm" style={{ width: '100%', marginBottom: 16 }} onClick={() => setModal('area')}>
            <Plus size={14} /> Add Area on Map
          </button>
          {areas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Circle size={20} /></div>
              <h3>No areas yet</h3>
              <p>Tap above to mark your delivery area on the map</p>
            </div>
          ) : areas.map(area => {
            const node = area.node || {};
            return (
              <div key={area.id || area.areaId} className="card" style={{ marginBottom: 10 }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)' }}>{area.areaName || area.name}</div>
                    {node.label && (
                      <div style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <MapPin size={11} /> {node.label}
                      </div>
                    )}
                    {area.threshold && (
                      <div style={{ fontSize: 11, color: 'var(--blue)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                        Radius: {(area.threshold / 1000).toFixed(1)} km
                      </div>
                    )}
                  </div>
                  <button className="btn btn-danger btn-sm" style={{ padding: 8 }}
                    onClick={() => deleteArea(area.id || area.areaId)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Map Modals */}
      {modal === 'route' && (
        <RouteMapModal
          loading={actionLoading}
          onClose={() => setModal(null)}
          onSave={addRoute}
        />
      )}
      {modal === 'area' && (
        <AreaMapModal
          loading={actionLoading}
          onClose={() => setModal(null)}
          onSave={addArea}
        />
      )}
    </div>
  );
}
