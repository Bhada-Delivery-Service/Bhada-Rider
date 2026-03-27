import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin, Plus, Trash2, RefreshCw, X, Route, Navigation,
  Circle, CheckCircle, Crosshair, ChevronRight, Eye, Layers, Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ridersAPI, serviceAreaAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ─── Google Maps loader ─────────────────────────────────────────────────── */
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
      mapsLoaded = true; mapsLoading = false;
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
const DEFAULT_CENTER = { lat: 19.0760, lng: 72.8777 };
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

/* ─── Reusable Place Search Box ──────────────────────────────────────────── */
function PlaceSearchBox({ onPreview, placeholder = 'Search location…', accentColor = '#00e5a0' }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const pacContainerRef = useRef(null);
  const [query, setQuery] = useState('');
  const onPreviewRef = useRef(onPreview);
  useEffect(() => { onPreviewRef.current = onPreview; }, [onPreview]);

  useEffect(() => {
    if (!window.google?.maps?.places || !inputRef.current) return;
    if (autocompleteRef.current) return;

    const beforeCount = document.querySelectorAll('.pac-container').length;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'in' },
      fields: ['geometry', 'name', 'formatted_address', 'address_components'],
    });

    requestAnimationFrame(() => {
      const all = document.querySelectorAll('.pac-container');
      if (all.length > beforeCount) {
        pacContainerRef.current = all[all.length - 1];
        pacContainerRef.current.style.zIndex = '9999';
      }
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry?.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const comps = place.address_components || [];
      const sub = comps.find(c => c.types.includes('sublocality_level_1') || c.types.includes('sublocality'));
      const loc = comps.find(c => c.types.includes('locality'));
      const label = sub?.long_name || loc?.long_name || place.name || place.formatted_address?.split(',')[0] || '';
      const fullAddress = place.formatted_address || label;

      setQuery(place.name || label);
      onPreviewRef.current({ lat, lng, label: label || place.name, fullAddress });
    });

    return () => {
      if (pacContainerRef.current) {
        pacContainerRef.current.remove();
        pacContainerRef.current = null;
      }
    };
  }, []);

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <Search size={14} style={{ position: 'absolute', left: 10, color: accentColor, pointerEvents: 'none', flexShrink: 0 }} />
      <input
        ref={inputRef}
        type="text"
        className="form-input"
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ width: '100%', paddingLeft: 32, fontSize: 13 }}
        autoComplete="off"
      />
      {query && (
        <button
          onClick={handleClear}
          style={{ position: 'absolute', right: 8, background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}

/* ─── Route Map Modal (Redesigned) ──────────────────────────────────────── */
function RouteMapModal({ onClose, onSave, loading }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const directionsRendererRef = useRef(null);
  const circlesRef = useRef([]);

  const [mapsReady, setMapsReady] = useState(mapsLoaded);
  const [step, setStep] = useState(1); // 1=start, 2=end, 3=details
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [routeName, setRouteName] = useState('');
  const routeNameRef = useRef(null); // uncontrolled ref for the input to prevent focus loss
  const [editingName, setEditingName] = useState(false);
  const [threshold1, setThreshold1] = useState(500);
  const [threshold2, setThreshold2] = useState(500);
  const [threshold3, setThreshold3] = useState(300);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [fetchingRoute, setFetchingRoute] = useState(false);
  const [locating, setLocating] = useState(false);
  const [encodedPolyline, setEncodedPolyline] = useState('');
  const [registered, setRegistered] = useState(false);

  const [preview, setPreview] = useState(null);
  const previewMarkerRef = useRef(null);
  const geocoder = useRef(null);
  const directionsService = useRef(null);

  // Route name is entered manually by rider — no auto-fill

  // Update circles when thresholds change
  useEffect(() => {
    if (!mapInstance.current) return;
    circlesRef.current.forEach(c => c.setMap && c.setMap(null));
    circlesRef.current = circlesRef.current.filter(c => !c._isThreshold);

    if (startPoint) {
      const c1 = new window.google.maps.Circle({
        center: { lat: startPoint.lat, lng: startPoint.lng },
        radius: threshold1,
        strokeColor: '#00e5a0', strokeOpacity: 0.8, strokeWeight: 2,
        fillColor: '#00e5a0', fillOpacity: 0.08,
        map: mapInstance.current,
      });
      c1._isThreshold = true;
      circlesRef.current.push(c1);
    }
    if (endPoint) {
      const c2 = new window.google.maps.Circle({
        center: { lat: endPoint.lat, lng: endPoint.lng },
        radius: threshold2,
        strokeColor: '#00e5a0', strokeOpacity: 0.8, strokeWeight: 2,
        fillColor: '#00e5a0', fillOpacity: 0.08,
        map: mapInstance.current,
      });
      c2._isThreshold = true;
      circlesRef.current.push(c2);
    }
  }, [startPoint, endPoint, threshold1, threshold2]);

  const handlePreviewPlace = useCallback((point, type) => {
    if (!mapInstance.current) return;
    if (previewMarkerRef.current) { previewMarkerRef.current.setMap(null); previewMarkerRef.current = null; }

    mapInstance.current.setCenter({ lat: point.lat, lng: point.lng });
    mapInstance.current.setZoom(15);

    previewMarkerRef.current = new window.google.maps.Marker({
      position: { lat: point.lat, lng: point.lng },
      map: mapInstance.current,
      title: point.label,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12, fillColor: '#00e5a0', fillOpacity: 0.3,
        strokeColor: '#00e5a0', strokeWeight: 3, strokeOpacity: 1,
      },
      zIndex: 999,
    });
    setPreview({ ...point, type });
  }, []);

  const handleConfirmPreview = useCallback(() => {
    if (!preview) return;
    if (previewMarkerRef.current) { previewMarkerRef.current.setMap(null); previewMarkerRef.current = null; }
    placeMarker(preview.lat, preview.lng, preview.type, preview.label);
    if (preview.type === 'start') {
      setStartPoint(preview);
    } else {
      setEndPoint(preview);
    }
    setPreview(null);
  }, [preview]);

  const handleCancelPreview = useCallback(() => {
    if (previewMarkerRef.current) { previewMarkerRef.current.setMap(null); previewMarkerRef.current = null; }
    setPreview(null);
  }, []);

  useEffect(() => {
    if (!MAPS_API_KEY) return;
    loadGoogleMaps(MAPS_API_KEY)
      .then(() => setMapsReady(true))
      .catch(() => toast.error('Failed to load Google Maps'));
  }, []);

  useEffect(() => {
    if (!mapsReady || !mapRef.current || mapInstance.current) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: DEFAULT_CENTER, zoom: 13,
      styles: DARK_STYLE, disableDefaultUI: true, zoomControl: true, gestureHandling: 'greedy',
    });
    mapInstance.current = map;
    geocoder.current = new window.google.maps.Geocoder();
    directionsService.current = new window.google.maps.DirectionsService();

    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: { strokeColor: '#00e5a0', strokeOpacity: 0.9, strokeWeight: 4 },
    });
    directionsRendererRef.current.setMap(map);

    map.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      reverseGeocode(lat, lng, (label) => {
        setStep(prev => {
          if (prev === 1) {
            placeMarker(lat, lng, 'start', label);
            setStartPoint({ lat, lng, label });
            return 2;
          } else if (prev === 2) {
            placeMarker(lat, lng, 'end', label);
            setEndPoint({ lat, lng, label });
            return 3;
          }
          return prev;
        });
      });
    });

    getCurrentLocation(map);
  }, [mapsReady]);

  useEffect(() => {
    if (!mapInstance.current || !startPoint || !endPoint || !directionsService.current) return;
    setFetchingRoute(true);
    setEncodedPolyline('');

    directionsService.current.route(
      {
        origin: { lat: startPoint.lat, lng: startPoint.lng },
        destination: { lat: endPoint.lat, lng: endPoint.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setFetchingRoute(false);
        if (status === 'OK') {
          directionsRendererRef.current.setDirections(result);
          const leg = result.routes[0]?.legs[0];
          setRouteDistance(leg?.distance?.text || null);
          setRouteDuration(leg?.duration?.text || null);
          setEncodedPolyline(result.routes[0]?.overview_polyline || '');
          mapInstance.current.fitBounds(result.routes[0].bounds, 60);
        } else {
          toast.error('Could not fetch road route — showing straight line');
          if (window.google.maps.geometry?.encoding) {
            const path = [
              new window.google.maps.LatLng(startPoint.lat, startPoint.lng),
              new window.google.maps.LatLng(endPoint.lat, endPoint.lng),
            ];
            setEncodedPolyline(window.google.maps.geometry.encoding.encodePath(path));
          }
        }
      }
    );
  }, [startPoint, endPoint]);

  const reverseGeocode = (lat, lng, cb) => {
    if (!geocoder.current) { cb('Unknown location'); return; }
    geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const parts = results[0].address_components;
        // Try sublocality first, then locality, then first component of formatted address
        const sub = parts.find(p => p.types.includes('sublocality_level_1') || p.types.includes('sublocality'));
        const loc = parts.find(p => p.types.includes('locality'));
        const name = sub?.long_name || loc?.long_name || results[0].formatted_address.split(',')[0];
        cb(name);
      } else {
        cb('Unknown location');
      }
    });
  };

  const getCurrentLocation = (map) => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => { map.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }); map.setZoom(15); },
      () => {}, { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const placeMarker = (lat, lng, type, label) => {
    markersRef.current = markersRef.current.filter(m => {
      if (m._type === type) { m.setMap(null); return false; }
      return true;
    });
    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstance.current,
      title: label,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10, fillColor: '#00e5a0', fillOpacity: 1,
        strokeColor: '#fff', strokeWeight: 2,
      },
    });
    marker._type = type;
    markersRef.current.push(marker);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstance.current) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapInstance.current.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
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
    circlesRef.current.forEach(c => c.setMap && c.setMap(null));
    circlesRef.current = [];
    if (directionsRendererRef.current) directionsRendererRef.current.setDirections({ routes: [] });
    setStartPoint(null); setEndPoint(null);
    setRouteDistance(null); setRouteDuration(null);
    setEncodedPolyline(''); setStep(1);
  };

  const handleFinalSave = () => {
    if (!startPoint || !endPoint) { toast.error('Set both points'); return; }
    const name = routeNameRef.current?.value?.trim() || routeName.trim();
    if (!name) { toast.error('Enter a route name'); return; }
    if (!encodedPolyline) { toast.error('Route encoding not ready yet'); return; }
    onSave({
      routeName: name,
      encoding: encodedPolyline,
      node1: { latitude: startPoint.lat, longitude: startPoint.lng, label: startPoint.label },
      node2: { latitude: endPoint.lat, longitude: endPoint.lng, label: endPoint.label },
      threshold1: Number(threshold1) / 1000,
      threshold2: Number(threshold2) / 1000,
      threshold3: Number(threshold3) / 1000,
    });
  };

  /* ── UI helpers ── */
  const accent = '#00e5a0';

  const SectionBadge = ({ text }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
      padding: '8px 12px', background: `${accent}12`,
      borderRadius: 10, border: `1px solid ${accent}33`,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}` }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.08em' }}>{text}</span>
    </div>
  );

  const SliderRow = ({ label, sublabel, value, onChange, min = 100, max = 5000, step = 50 }) => {
    const pct = ((value - min) / (max - min)) * 100;
    const display = value >= 1000 ? `${(value / 1000).toFixed(1)} km` : `${value} m`;
    return (
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#c8cec9' }}>{label}</div>
            <div style={{ fontSize: 10, color: '#556', marginTop: 1 }}>{sublabel}</div>
          </div>
          <div style={{
            fontSize: 13, fontWeight: 700, color: accent,
            background: `${accent}18`, border: `1px solid ${accent}44`,
            borderRadius: 7, padding: '2px 9px', fontFamily: 'monospace',
          }}>{display}</div>
        </div>
        <div style={{ position: 'relative', height: 22, display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: 4, background: '#2a2e2a', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 4, background: `linear-gradient(90deg, ${accent}88, ${accent})`, borderRadius: 2 }} />
          <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
            style={{ position: 'absolute', left: 0, right: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 22, margin: 0 }} />
          <div style={{
            position: 'absolute', left: `calc(${pct}% - 10px)`,
            width: 20, height: 20, borderRadius: '50%',
            background: accent, border: '3px solid #141714',
            boxShadow: `0 2px 10px ${accent}88`, pointerEvents: 'none',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <span style={{ fontSize: 10, color: '#444', fontFamily: 'monospace' }}>100m</span>
          <span style={{ fontSize: 10, color: '#444', fontFamily: 'monospace' }}>5km</span>
        </div>
      </div>
    );
  };

  const StepDots = () => {
    const steps = ['Start', 'End', 'Details'];
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 20 }}>
        {steps.map((s, i) => {
          const idx = i + 1;
          const done = step > idx || registered;
          const active = step === idx && !registered;
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: done ? accent : active ? `${accent}22` : '#1e2120',
                  border: `2px solid ${done || active ? accent : '#2e3330'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: active ? `0 0 16px ${accent}55` : done ? `0 0 10px ${accent}44` : 'none',
                  transition: 'all 0.3s',
                }}>
                  {done ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L4.5 8.5L10 3" stroke="#0a1210" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 700, color: active ? accent : '#444' }}>{idx}</span>
                  )}
                </div>
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', color: active ? accent : done ? `${accent}bb` : '#444', textTransform: 'uppercase' }}>{s}</span>
              </div>
              {i < 2 && (
                <div style={{
                  width: 44, height: 2, margin: '0 4px', marginBottom: 16,
                  background: (step > idx || registered) ? accent : '#1e2120',
                  borderRadius: 1, transition: 'background 0.3s',
                }} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  /* preview banner JSX — rendered inline, not as a component */
  const previewBannerJSX = preview ? (
    <div style={{ marginBottom: 12, background: '#0d1220', border: `1.5px solid ${accent}`, borderRadius: 12, padding: '10px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: accent, opacity: 0.7, flexShrink: 0, marginTop: 3, display: 'inline-block' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 2 }}>
            {preview.type === 'start' ? 'Set as Start Point?' : 'Set as End Point?'}
          </div>
          <div style={{ fontSize: 13, color: '#e0e0d8', fontWeight: 600 }}>{preview.label}</div>
          {preview.fullAddress && preview.fullAddress !== preview.label && (
            <div style={{ fontSize: 11, color: '#556', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preview.fullAddress}</div>
          )}
          <div style={{ fontSize: 10, color: '#556', fontFamily: 'monospace', marginTop: 2 }}>{preview.lat.toFixed(5)}, {preview.lng.toFixed(5)}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleCancelPreview} style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: '1px solid #2e3330', background: 'transparent', color: '#888', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✕ Cancel</button>
        <button onClick={handleConfirmPreview} style={{ flex: 2, padding: '7px 0', borderRadius: 8, border: 'none', background: accent, color: '#051a0f', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          ✓ Confirm {preview.type === 'start' ? 'Start' : 'End'}
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', flexDirection: 'column',
      background: '#05080f',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, background: '#141714',
        borderBottom: `2px solid ${accent}`,
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${accent}18`, border: `1px solid ${accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Route size={15} style={{ color: accent }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#eaeee8', letterSpacing: '-0.01em' }}>New Route</div>
            <div style={{ fontSize: 10, color: '#445' }}>
              {fetchingRoute ? '🔄 Calculating road route…' : step === 1 ? 'Set start point' : step === 2 ? 'Set end point' : 'Configure details'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StepDots />
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #2e3330', color: '#888', cursor: 'pointer', padding: 7, borderRadius: 8, display: 'flex' }}>
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Map — always mounted, never unmounts, fixed height */}
      <div style={{ height: '42vh', flexShrink: 0, position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        {!mapsReady && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: '#0d1117', zIndex: 3 }}>
            {!MAPS_API_KEY ? (
              <div style={{ textAlign: 'center', color: '#556', padding: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🗺</div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Google Maps API key not set</div>
                <div style={{ fontSize: 12 }}>Add VITE_GOOGLE_MAPS_API_KEY to .env</div>
              </div>
            ) : <div className="loader" />}
          </div>
        )}
        {mapsReady && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 2 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="4" fill={accent} opacity="0.9" />
              <circle cx="18" cy="18" r="8" stroke={accent} strokeWidth="1.5" opacity="0.5" />
              <line x1="18" y1="2" x2="18" y2="10" stroke={accent} strokeWidth="2" strokeLinecap="round" />
              <line x1="18" y1="26" x2="18" y2="34" stroke={accent} strokeWidth="2" strokeLinecap="round" />
              <line x1="2" y1="18" x2="10" y2="18" stroke={accent} strokeWidth="2" strokeLinecap="round" />
              <line x1="26" y1="18" x2="34" y2="18" stroke={accent} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}
        {mapsReady && (
          <button onClick={handleLocateMe} disabled={locating} style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 3, width: 40, height: 40, borderRadius: '50%', background: '#1a1e1a', border: `1px solid ${accent}44`, color: locating ? '#556' : accent, display: 'grid', placeItems: 'center', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
            <Crosshair size={16} style={{ animation: locating ? 'ksp 1s linear infinite' : 'none' }} />
          </button>
        )}
        {(startPoint || endPoint) && (
          <button onClick={resetPoints} style={{ position: 'absolute', top: 10, right: 10, zIndex: 3, background: 'rgba(13,18,32,0.9)', border: '1px solid #2e3330', borderRadius: 8, padding: '5px 10px', color: '#888', cursor: 'pointer', fontSize: 11 }}>↩ Reset</button>
        )}
        {mapsReady && (startPoint || endPoint) && (
          <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 3, background: 'rgba(13,18,32,0.92)', border: '1px solid #2e3330', borderRadius: 8, padding: '7px 10px', fontSize: 11 }}>
            {startPoint && <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: endPoint ? 3 : 0 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: accent, display: 'inline-block' }} /><span style={{ color: '#c8cec9' }}>{startPoint.label}</span></div>}
            {endPoint && <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: accent, display: 'inline-block' }} /><span style={{ color: '#c8cec9' }}>{endPoint.label}</span></div>}
            {routeDistance && <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px solid #2e3330', color: '#556', fontFamily: 'monospace', fontSize: 10 }}>🛣 {routeDistance} · {routeDuration}</div>}
          </div>
        )}
      </div>

      {/* Bottom drawer — all steps rendered together with display:none toggling so inputs are never unmounted */}
      <div style={{ flex: 1, background: '#141714', borderTop: `2px solid ${accent}22`, borderRadius: '18px 18px 0 0', overflowY: 'auto', overscrollBehavior: 'contain', padding: '14px 16px 28px', boxShadow: '0 -8px 32px rgba(0,0,0,0.7)', minHeight: 0 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: '#2e3330', margin: '0 auto 14px' }} />

        {/* ── STEP 1 ── */}
        <div style={{ display: step === 1 ? 'block' : 'none' }}>
          <SectionBadge text="SET YOUR START POINT" />
          {mapsReady && <PlaceSearchBox placeholder="Search start location…" accentColor={accent} onPreview={(p) => handlePreviewPlace(p, 'start')} />}
          {startPoint && <div style={{ fontSize: 12, color: accent, marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: accent, display: 'inline-block', flexShrink: 0 }} />{startPoint.label}</div>}
          {step === 1 && previewBannerJSX}
          <div style={{ padding: '14px', background: '#1a1e1a', borderRadius: 12, border: '1px solid #2a2e2a', marginTop: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: '0.08em', marginBottom: 12 }}>START ZONE THRESHOLD · T1</div>
            <SliderRow label="Pickup Radius" sublabel="How far from start is 'at stop'" value={threshold1} onChange={setThreshold1} />
          </div>
          <button onClick={() => setStep(2)} style={{ width: '100%', marginTop: 14, padding: '12px 0', borderRadius: 11, background: `linear-gradient(135deg, ${accent}, #00c97a)`, border: 'none', fontSize: 14, fontWeight: 700, color: '#051a0f', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 4px 18px ${accent}44` }}>
            Set End Point <ChevronRight size={16} />
          </button>
        </div>

        {/* ── STEP 2 ── */}
        <div style={{ display: step === 2 ? 'block' : 'none' }}>
          <SectionBadge text="SET YOUR END POINT" />
          {mapsReady && <PlaceSearchBox placeholder="Search end location…" accentColor={accent} onPreview={(p) => handlePreviewPlace(p, 'end')} />}
          {endPoint && <div style={{ fontSize: 12, color: accent, marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: accent, display: 'inline-block', flexShrink: 0 }} />{endPoint.label}</div>}
          {step === 2 && previewBannerJSX}
          <div style={{ padding: '14px', background: '#1a1e1a', borderRadius: 12, border: '1px solid #2a2e2a', marginTop: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: '0.08em', marginBottom: 12 }}>END ZONE THRESHOLD · T2</div>
            <SliderRow label="Drop-off Radius" sublabel="How far from end is 'arrived'" value={threshold2} onChange={setThreshold2} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px 0', borderRadius: 11, background: 'transparent', border: '1.5px solid #2e3330', fontSize: 14, fontWeight: 500, color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 12L3 8L7 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Back
            </button>
            <button onClick={() => setStep(3)} style={{ flex: 2, padding: '12px 0', borderRadius: 11, background: `linear-gradient(135deg, ${accent}, #00c97a)`, border: 'none', fontSize: 14, fontWeight: 700, color: '#051a0f', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 4px 18px ${accent}44` }}>
              Continue to Details <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ── STEP 3 ── */}
        <div style={{ display: step === 3 ? 'block' : 'none' }}>
          <SectionBadge text="ROUTE DETAILS & WAYPOINTS" />

          {/* Route Preview */}
          <div style={{ background: '#1a1e1a', borderRadius: 12, border: '1px solid #252a25', padding: '12px 14px', marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#445', letterSpacing: '0.1em', marginBottom: 10 }}>ROUTE PREVIEW</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent, boxShadow: `0 0 6px ${accent}` }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: accent, letterSpacing: '0.06em' }}>START</span>
                </div>
                <div style={{ fontSize: 12, color: '#c8cec9', fontWeight: 500 }}>{startPoint?.label}</div>
                <button onClick={() => setStep(1)} style={{ marginTop: 4, background: 'none', border: `1px solid ${accent}44`, borderRadius: 5, padding: '1px 7px', fontSize: 9, color: accent, cursor: 'pointer' }}>Edit</button>
              </div>
              <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: 40, height: 2, background: accent }} />
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 5H9M6 2L9 5L6 8" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2, justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: accent, letterSpacing: '0.06em' }}>END</span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent, boxShadow: `0 0 6px ${accent}` }} />
                </div>
                <div style={{ fontSize: 12, color: '#c8cec9', fontWeight: 500 }}>{endPoint?.label}</div>
                <button onClick={() => setStep(2)} style={{ marginTop: 4, background: 'none', border: `1px solid ${accent}44`, borderRadius: 5, padding: '1px 7px', fontSize: 9, color: accent, cursor: 'pointer' }}>Edit</button>
              </div>
            </div>
            {routeDistance && <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #252a25', fontSize: 11, color: '#556', fontFamily: 'monospace' }}>🛣 {routeDistance} · {routeDuration}</div>}
          </div>

          {/* Route Name — uncontrolled input via ref so typing never loses focus */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#445', letterSpacing: '0.08em', marginBottom: 8 }}>ROUTE NAME</div>
            <input
              ref={routeNameRef}
              defaultValue={routeName}
              placeholder="e.g. Morning Shift Route"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid #2e3330`, background: '#1e2120', color: '#e0e0d8', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = accent}
              onBlur={e => e.target.style.borderColor = '#2e3330'}
            />
          </div>

          {/* Waypoint Radius */}
          <div style={{ padding: '14px', background: '#1a1b1e', borderRadius: 12, border: '1px solid #2a2b2e', marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6c9fff', letterSpacing: '0.08em', marginBottom: 10 }}>WAYPOINT RADIUS · T3</div>
            <div style={{ position: 'relative', height: 22, display: 'flex', alignItems: 'center', marginBottom: 2 }}>
              <div style={{ position: 'absolute', left: 0, right: 0, height: 4, background: '#2a2e2a', borderRadius: 2 }} />
              <div style={{ position: 'absolute', left: 0, width: `${((threshold3 - 50) / (2000 - 50)) * 100}%`, height: 4, background: 'linear-gradient(90deg, #6c9fff88, #6c9fff)', borderRadius: 2 }} />
              <input type="range" min={50} max={2000} step={25} value={threshold3} onChange={e => setThreshold3(Number(e.target.value))} style={{ position: 'absolute', left: 0, right: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 22, margin: 0 }} />
              <div style={{ position: 'absolute', left: `calc(${((threshold3 - 50) / (2000 - 50)) * 100}% - 10px)`, width: 20, height: 20, borderRadius: '50%', background: '#6c9fff', border: '3px solid #141714', boxShadow: '0 2px 10px #6c9fff88', pointerEvents: 'none' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: '#444', fontFamily: 'monospace' }}>50m</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#6c9fff', fontFamily: 'monospace', background: '#6c9fff18', border: '1px solid #6c9fff44', borderRadius: 7, padding: '2px 9px' }}>{threshold3 >= 1000 ? `${(threshold3 / 1000).toFixed(1)} km` : `${threshold3} m`}</span>
              <span style={{ fontSize: 10, color: '#444', fontFamily: 'monospace' }}>2km</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: '12px 0', borderRadius: 11, background: 'transparent', border: '1.5px solid #2e3330', fontSize: 14, fontWeight: 500, color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 12L3 8L7 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Back
            </button>
            <button onClick={handleFinalSave} disabled={loading || fetchingRoute || !encodedPolyline} style={{ flex: 2, padding: '12px 0', borderRadius: 11, background: loading || fetchingRoute || !encodedPolyline ? '#2a2e2a' : 'linear-gradient(135deg, #6c9fff, #3a7bef)', border: 'none', fontSize: 14, fontWeight: 700, color: loading || fetchingRoute || !encodedPolyline ? '#556' : '#fff', cursor: loading || fetchingRoute || !encodedPolyline ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading || fetchingRoute || !encodedPolyline ? 'none' : '0 4px 18px #6c9fff44' }}>
              {loading ? 'Saving…' : fetchingRoute ? 'Routing…' : <><CheckCircle size={14} /> Save Route</>}
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes ksp { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* ─── Area Map Modal ─────────────────────────────────────────────────────── */
function AreaMapModal({ onClose, onSave, loading }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const [mapsReady, setMapsReady] = useState(mapsLoaded);
  const [center, setCenter] = useState(null);
  const [radius, setRadius] = useState(2000);
  const [areaName, setAreaName] = useState('');
  const [locating, setLocating] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const geocoder = useRef(null);

  const [preview, setPreview] = useState(null);
  const previewMarkerRef = useRef(null);

  const handlePreviewPlace = useCallback((point) => {
    if (!mapInstance.current) return;
    if (previewMarkerRef.current) { previewMarkerRef.current.setMap(null); previewMarkerRef.current = null; }
    mapInstance.current.setCenter({ lat: point.lat, lng: point.lng });
    mapInstance.current.setZoom(14);
    previewMarkerRef.current = new window.google.maps.Marker({
      position: { lat: point.lat, lng: point.lng },
      map: mapInstance.current,
      title: point.label,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12, fillColor: '#4d9fff', fillOpacity: 0.3,
        strokeColor: '#4d9fff', strokeWeight: 3, strokeOpacity: 1,
      },
      zIndex: 999,
    });
    setPreview(point);
  }, []);

  const handleConfirmPreview = useCallback(() => {
    if (!preview) return;
    if (previewMarkerRef.current) { previewMarkerRef.current.setMap(null); previewMarkerRef.current = null; }
    placeCenter(preview.lat, preview.lng, preview.label);
    setPreview(null);
  }, [preview]);

  const handleCancelPreview = useCallback(() => {
    if (previewMarkerRef.current) { previewMarkerRef.current.setMap(null); previewMarkerRef.current = null; }
    setPreview(null);
  }, []);

  useEffect(() => {
    if (!MAPS_API_KEY) return;
    loadGoogleMaps(MAPS_API_KEY).then(() => setMapsReady(true)).catch(() => toast.error('Failed to load Google Maps'));
  }, []);

  useEffect(() => {
    if (!mapsReady || !mapRef.current || mapInstance.current) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: DEFAULT_CENTER, zoom: 12,
      styles: DARK_STYLE, disableDefaultUI: true, zoomControl: true, gestureHandling: 'greedy',
    });
    mapInstance.current = map;
    geocoder.current = new window.google.maps.Geocoder();
    map.addListener('click', (e) => {
      const lat = e.latLng.lat(); const lng = e.latLng.lng();
      if (!geocoder.current) { placeCenter(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`); return; }
      geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
        const label = (status === 'OK' && results[0])
          ? (results[0].address_components.find(p => p.types.includes('sublocality') || p.types.includes('locality'))?.long_name || results[0].formatted_address.split(',')[0])
          : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        placeCenter(lat, lng, label);
      });
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { map.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }); map.setZoom(14); },
        () => {}, { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [mapsReady]);

  useEffect(() => {
    if (!mapInstance.current || !center) return;
    updateCircle(center.lat, center.lng, radius);
  }, [radius, center]);

  const placeCenter = (lat, lng, label) => { setCenter({ lat, lng, label }); updateCircle(lat, lng, radius); };

  const updateCircle = (lat, lng, r) => {
    const map = mapInstance.current;
    if (markerRef.current) markerRef.current.setMap(null);
    if (circleRef.current) circleRef.current.setMap(null);
    markerRef.current = new window.google.maps.Marker({
      position: { lat, lng }, map,
      icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#4d9fff', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 },
    });
    circleRef.current = new window.google.maps.Circle({
      center: { lat, lng }, radius: r,
      strokeColor: '#4d9fff', strokeOpacity: 0.8, strokeWeight: 2,
      fillColor: '#4d9fff', fillOpacity: 0.1, map,
    });
    map.fitBounds(circleRef.current.getBounds(), 40);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstance.current) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { mapInstance.current.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }); mapInstance.current.setZoom(14); setLocating(false); },
      () => { setLocating(false); toast.error('Location access denied'); },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSave = () => {
    if (!center) { toast.error('Tap on the map to set your area center'); return; }
    if (!areaName.trim()) { toast.error('Enter an area name'); return; }
    onSave({ areaName: areaName.trim(), node: { latitude: center.lat, longitude: center.lng, label: center.label }, threshold: radius });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', background: '#05080f' }}>
      <div style={{ flexShrink: 0, background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', padding: '12px 16px 14px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Add Delivery Area</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{center ? '✅ Area set! Adjust radius and save.' : '📍 Search or tap map to set area center'}</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border)', color: 'var(--text-1)', cursor: 'pointer', padding: 8, borderRadius: 8, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>
        {mapsReady && <PlaceSearchBox placeholder="Search area location…" accentColor="#4d9fff" onPreview={handlePreviewPlace} />}
        {preview && (
          <div style={{ marginTop: 10, background: 'rgba(13,18,32,0.97)', border: '1.5px solid #4d9fff', borderRadius: 12, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#4d9fff', opacity: 0.6, flexShrink: 0, marginTop: 3, display: 'inline-block' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4d9fff', marginBottom: 2 }}>Set as Area Center?</div>
                <div style={{ fontSize: 13, color: 'var(--text-0)', fontWeight: 600, marginBottom: 2 }}>{preview.label}</div>
                {preview.fullAddress && preview.fullAddress !== preview.label && (
                  <div style={{ fontSize: 11, color: 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{preview.fullAddress}</div>
                )}
                <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{preview.lat.toFixed(5)}, {preview.lng.toFixed(5)}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleCancelPreview} style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid var(--border-bright)', background: 'transparent', color: 'var(--text-2)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✕ Cancel</button>
              <button onClick={handleConfirmPreview} style={{ flex: 2, padding: '8px 0', borderRadius: 8, border: 'none', background: '#4d9fff', color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>✓ Confirm Area Center</button>
            </div>
          </div>
        )}
      </div>

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
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg-2)' }}><div className="loader" /></div>
        ) : (
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        )}
        {mapsReady && (
          <button onClick={handleLocateMe} disabled={locating} style={{
            position: 'absolute', bottom: 16, right: 16, zIndex: 1,
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--bg-1)', border: '1px solid var(--border-bright)',
            color: locating ? 'var(--text-2)' : 'var(--blue)',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}>
            <Crosshair size={18} style={{ animation: locating ? 'ksp 1s linear infinite' : 'none' }} />
          </button>
        )}
        {mapsReady && center && (
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1, background: 'rgba(13,18,32,0.92)', border: '1px solid var(--border-bright)', borderRadius: 8, padding: '8px 12px', fontSize: 11 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4d9fff', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-1)' }}>{center.label}</span>
            </div>
            <div style={{ color: 'var(--text-2)', marginTop: 2 }}>{(radius / 1000).toFixed(1)} km radius</div>
          </div>
        )}
      </div>

      <div style={{
        flexShrink: 0, background: 'var(--bg-1)', borderTop: '3px solid var(--blue)',
        borderRadius: '20px 20px 0 0', boxShadow: '0 -8px 32px rgba(0,0,0,0.7)',
        transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
        maxHeight: sheetOpen ? '60vh' : '48px', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 10,
      }}>
        <div onTouchStart={(e) => { e.currentTarget._startY = e.touches[0].clientY; e.currentTarget._moved = false; }}
          onTouchMove={(e) => { e.currentTarget._moved = true; }}
          onTouchEnd={(e) => { const dy = e.changedTouches[0].clientY - e.currentTarget._startY; if (Math.abs(dy) > 25) setSheetOpen(dy < 0); else if (!e.currentTarget._moved) setSheetOpen(o => !o); }}
          onClick={() => setSheetOpen(o => !o)}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 16px 8px', flexShrink: 0, cursor: 'pointer', userSelect: 'none', gap: 5, touchAction: 'pan-x' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: sheetOpen ? 'rgba(255,255,255,0.45)' : 'var(--blue)', transition: 'background 0.2s' }} />
          <span style={{ fontSize: 11, lineHeight: 1, color: sheetOpen ? 'var(--text-2)' : 'var(--blue)', transition: 'color 0.2s' }}>
            {sheetOpen ? '↓ swipe or tap to close' : '↑ swipe or tap to open'}
          </span>
        </div>
        <div style={{ overflowY: 'auto', overscrollBehavior: 'contain', padding: '0 16px 28px', flex: 1 }}>
          {center && (
            <div style={{ padding: '10px 12px', background: 'var(--blue-dim)', border: '1px solid rgba(77,159,255,0.25)', borderRadius: 8, marginBottom: 12, fontSize: 12 }}>
              <div style={{ fontWeight: 600, color: 'var(--blue)', marginBottom: 2 }}>📍 Center</div>
              <div style={{ color: 'var(--text-1)' }}>{center.label}</div>
              <div style={{ color: 'var(--text-2)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>{center.lat.toFixed(6)}, {center.lng.toFixed(6)}</div>
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Area Name *</label>
            <input className="form-input" placeholder="e.g. Andheri West" value={areaName} onChange={e => setAreaName(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Radius</label>
              <span style={{ fontSize: 12, color: 'var(--blue)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{(radius / 1000).toFixed(1)} km</span>
            </div>
            <input type="range" min="500" max="20000" step="500" value={radius} onChange={e => setRadius(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--blue)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-2)' }}><span>0.5 km</span><span>20 km</span></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary flex-1" onClick={handleSave} disabled={loading || !center || !areaName.trim()}>
              {loading ? 'Saving…' : <><CheckCircle size={13} /> Save Area</>}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes ksp{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ─── View Map Modal ─────────────────────────────────────────────────────── */
function ViewMapModal({ routes, areas, onClose, initialTab }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const overlaysRef = useRef([]);
  const [mapsReady, setMapsReady] = useState(mapsLoaded);
  const [activeTab, setActiveTab] = useState(initialTab || 'routes');
  const [selectedId, setSelectedId] = useState('all');
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    if (!MAPS_API_KEY) return;
    loadGoogleMaps(MAPS_API_KEY).then(() => setMapsReady(true)).catch(() => toast.error('Failed to load Google Maps'));
  }, []);

  useEffect(() => {
    if (!mapsReady || !mapRef.current || mapInstance.current) return;
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: DEFAULT_CENTER, zoom: 12, styles: DARK_STYLE, disableDefaultUI: true, zoomControl: true, gestureHandling: 'greedy',
    });
    drawOverlays(activeTab, selectedId);
  }, [mapsReady]);

  useEffect(() => { if (!mapInstance.current) return; drawOverlays(activeTab, selectedId); }, [activeTab, selectedId, routes, areas]);

  const ROUTE_COLOURS = ['#00e5a0', '#ffcc00', '#ff6b6b', '#b388ff', '#40c8e0'];
  const AREA_COLOURS = ['#4d9fff', '#ff9f43', '#ee5a24', '#a29bfe', '#55efc4'];

  const clearOverlays = () => { overlaysRef.current.forEach(o => o.setMap(null)); overlaysRef.current = []; };

  const drawOverlays = (tab, selId) => {
    if (!mapInstance.current || !window.google) return;
    clearOverlays();
    const bounds = new window.google.maps.LatLngBounds();
    let hasPoints = false;
    const newLegend = [];

    if (tab === 'routes') {
      const list = selId === 'all' ? routes : routes.filter(r => (r.id || r.routeId) === selId);
      list.forEach((route, idx) => {
        const color = ROUTE_COLOURS[idx % ROUTE_COLOURS.length];
        const n1 = route.node1 || {}; const n2 = route.node2 || {};
        let decodedPath = [];
        if (route.encoding && window.google.maps.geometry?.encoding) {
          try { decodedPath = window.google.maps.geometry.encoding.decodePath(route.encoding); } catch (_) {}
        }
        if (decodedPath.length < 2 && n1.latitude && n2.latitude) {
          decodedPath = [new window.google.maps.LatLng(n1.latitude, n1.longitude), new window.google.maps.LatLng(n2.latitude, n2.longitude)];
        }
        if (decodedPath.length >= 2) {
          const poly = new window.google.maps.Polyline({ path: decodedPath, strokeColor: color, strokeOpacity: 0.85, strokeWeight: 4, map: mapInstance.current });
          overlaysRef.current.push(poly);
          decodedPath.forEach(p => bounds.extend(p)); hasPoints = true;
          if (n1.latitude && route.threshold1) {
            const c1 = new window.google.maps.Circle({ center: { lat: n1.latitude, lng: n1.longitude }, radius: route.threshold1, strokeColor: color, strokeOpacity: 0.6, strokeWeight: 2, fillColor: color, fillOpacity: 0.1, map: mapInstance.current });
            overlaysRef.current.push(c1);
          }
          if (n2.latitude && route.threshold2) {
            const c2 = new window.google.maps.Circle({ center: { lat: n2.latitude, lng: n2.longitude }, radius: route.threshold2, strokeColor: '#ff4d6d', strokeOpacity: 0.6, strokeWeight: 2, fillColor: '#ff4d6d', fillOpacity: 0.1, map: mapInstance.current });
            overlaysRef.current.push(c2);
          }
          if (n1.latitude) {
            const sm = new window.google.maps.Marker({ position: { lat: n1.latitude, lng: n1.longitude }, map: mapInstance.current, title: n1.label || 'Start', icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 9, fillColor: color, fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 } });
            overlaysRef.current.push(sm);
          }
          if (n2.latitude) {
            const em = new window.google.maps.Marker({ position: { lat: n2.latitude, lng: n2.longitude }, map: mapInstance.current, title: n2.label || 'End', icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 9, fillColor: '#ff4d6d', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 } });
            overlaysRef.current.push(em);
          }
        }
        newLegend.push({ id: route.id || route.routeId, label: route.routeName || `${n1.label || '?'} → ${n2.label || '?'}`, color, sub: route.threshold1 ? `T1:${route.threshold1}m · T2:${route.threshold2}m · T3:${route.threshold3}m` : '' });
      });
    } else {
      const list = selId === 'all' ? areas : areas.filter(a => (a.id || a.areaId) === selId);
      list.forEach((area, idx) => {
        const color = AREA_COLOURS[idx % AREA_COLOURS.length];
        const node = area.node || {};
        if (!node.latitude) return;
        const circle = new window.google.maps.Circle({ center: { lat: node.latitude, lng: node.longitude }, radius: area.threshold || 2000, strokeColor: color, strokeOpacity: 0.8, strokeWeight: 2, fillColor: color, fillOpacity: 0.12, map: mapInstance.current });
        overlaysRef.current.push(circle);
        bounds.union(circle.getBounds()); hasPoints = true;
        const marker = new window.google.maps.Marker({ position: { lat: node.latitude, lng: node.longitude }, map: mapInstance.current, title: area.areaName || area.name || 'Area', icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: color, fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 } });
        overlaysRef.current.push(marker);
        newLegend.push({ id: area.id || area.areaId, label: area.areaName || area.name || 'Area', color, sub: area.threshold ? `${((area.threshold) / 1000).toFixed(1)} km radius` : '' });
      });
    }

    setLegendItems(newLegend);
    if (hasPoints && !bounds.isEmpty()) mapInstance.current.fitBounds(bounds, 60);
  };

  const activeItems = activeTab === 'routes' ? routes : areas;
  const hasData = activeItems.length > 0;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(5,8,15,0.97)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Layers size={18} style={{ color: 'var(--accent)' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>My Coverage Map</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Tap a route or area chip to highlight it</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-1)', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
      </div>
      <div style={{ display: 'flex', gap: 6, padding: '10px 16px 0', background: 'var(--bg-1)', flexShrink: 0 }}>
        {[{ key: 'routes', label: `🛣 Routes (${routes.length})` }, { key: 'areas', label: `📍 Areas (${areas.length})` }].map(t => (
          <button key={t.key} onClick={() => { setActiveTab(t.key); setSelectedId('all'); }}
            style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: activeTab === t.key ? 'var(--accent)' : 'var(--bg-2)', color: activeTab === t.key ? '#000' : 'var(--text-2)' }}>
            {t.label}
          </button>
        ))}
      </div>
      {hasData && (
        <div style={{ display: 'flex', gap: 6, padding: '8px 16px', overflowX: 'auto', background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <button onClick={() => setSelectedId('all')} style={{ flexShrink: 0, padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: selectedId === 'all' ? 'var(--accent)' : 'var(--bg-2)', color: selectedId === 'all' ? '#000' : 'var(--text-2)' }}>All</button>
          {activeItems.map((item, idx) => {
            const id = item.id || item.routeId || item.areaId;
            const label = item.routeName || item.areaName || item.name || `#${idx + 1}`;
            const colors = activeTab === 'routes' ? ROUTE_COLOURS : AREA_COLOURS;
            const color = colors[idx % colors.length];
            const isSelected = selectedId === id;
            return (
              <button key={id} onClick={() => setSelectedId(isSelected ? 'all' : id)}
                style={{ flexShrink: 0, padding: '4px 12px', borderRadius: 20, border: `1.5px solid ${color}`, cursor: 'pointer', fontSize: 11, fontWeight: 600, background: isSelected ? color : 'transparent', color: isSelected ? '#000' : color }}>
                {label}
              </button>
            );
          })}
        </div>
      )}
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
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg-2)' }}><div className="loader" /></div>
        ) : !hasData ? (
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg-2)' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-2)', padding: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }}>{activeTab === 'routes' ? '🛣' : '📍'}</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>No {activeTab === 'routes' ? 'routes' : 'areas'} registered</div>
              <div style={{ fontSize: 12 }}>Add {activeTab === 'routes' ? 'a route' : 'an area'} first</div>
            </div>
          </div>
        ) : (
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        )}
        {mapsReady && hasData && legendItems.length > 0 && (
          <div style={{ position: 'absolute', bottom: 16, left: 12, background: 'rgba(13,18,32,0.92)', border: '1px solid var(--border-bright)', borderRadius: 10, padding: '8px 12px', maxWidth: 'calc(100vw - 24px)', overflowX: 'auto' }}>
            {legendItems.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: legendItems.length > 1 ? 6 : 0 }}>
                <span style={{ width: activeTab === 'routes' ? 18 : 10, height: activeTab === 'routes' ? 3 : 10, borderRadius: activeTab === 'routes' ? 2 : '50%', background: item.color, display: 'inline-block', flexShrink: 0, marginTop: activeTab === 'routes' ? 7 : 4, border: activeTab === 'areas' ? `2px solid ${item.color}` : 'none' }} />
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-1)', fontWeight: 600 }}>{item.label}</div>
                  {item.sub && <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{item.sub}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
  const [modal, setModal] = useState(null);
  const [viewModal, setViewModal] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const [rRes, aRes] = await Promise.allSettled([ridersAPI.getRoutes(user.uid), ridersAPI.getAreas(user.uid)]);
      if (rRes.status === 'fulfilled') setRoutes(rRes.value.data?.data || []);
      if (aRes.status === 'fulfilled') setAreas(aRes.value.data?.data || []);
    } catch (_) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  }, [user?.uid]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addRoute = async (form) => {
    setActionLoading(true);
    try {
      try {
        const { data: saData } = await serviceAreaAPI.validate(form.node1.latitude, form.node1.longitude, form.node2.latitude, form.node2.longitude);
        if (!saData.data.bothServiced) {
          toast.error(saData.data.failReason || 'Route start or end point is outside active service areas.', { duration: 6000 });
          setActionLoading(false); return;
        }
      } catch {}
      await ridersAPI.addRoute(user.uid, form);
      toast.success('Route added!');
      setModal(null);
      try { await fetchData(); } catch {}
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add route'); }
    finally { setActionLoading(false); }
  };

  const deleteRoute = async (routeId) => {
    if (!window.confirm('Delete this route?')) return;
    setRoutes(prev => prev.filter(r => (r.id || r.routeId) !== routeId));
    try { await ridersAPI.deleteRoute(user.uid, routeId); toast.success('Route deleted'); await fetchData(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); await fetchData(); }
  };

  const addArea = async (form) => {
    setActionLoading(true);
    try {
      try {
        const { data: saData } = await serviceAreaAPI.validateArea(form.node.latitude, form.node.longitude);
        if (!saData.data.serviced) {
          toast.error(saData.data.failReason || 'The selected area is outside active service zones.', { duration: 6000 });
          setActionLoading(false); return;
        }
      } catch {}
      await ridersAPI.addArea(user.uid, form);
      toast.success('Area added!');
      setModal(null);
      try { await fetchData(); } catch {}
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add area'); }
    finally { setActionLoading(false); }
  };

  const deleteArea = async (areaId) => {
    if (!window.confirm('Delete this area?')) return;
    setAreas(prev => prev.filter(a => (a.id || a.areaId) !== areaId));
    try { await ridersAPI.deleteArea(user.uid, areaId); toast.success('Area deleted'); await fetchData(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); await fetchData(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-16">
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Routes & Areas</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Set your delivery coverage on the map</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchData} style={{ padding: 8 }}><RefreshCw size={15} /></button>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, background: 'var(--bg-2)', padding: 4, borderRadius: 10 }}>
        {['routes', 'areas'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: tab === t ? 'var(--bg-1)' : 'transparent', color: tab === t ? 'var(--accent)' : 'var(--text-2)', transition: 'all 0.15s ease' }}>
            {t === 'routes' ? '🛣 Routes' : '📍 Areas'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-center"><div className="loader" /></div>
      ) : tab === 'routes' ? (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setModal('route')}><Plus size={14} /> Add Route on Map</button>
            {routes.length > 0 && <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setViewModal('routes')}><Eye size={14} /> View on Map</button>}
          </div>
          {routes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Route size={20} /></div>
              <h3>No routes yet</h3>
              <p>Tap above to draw your route on the map</p>
            </div>
          ) : routes.map(route => {
            const n1 = route.node1 || {}; const n2 = route.node2 || {};
            return (
              <div key={route.id || route.routeId} className="card" style={{ marginBottom: 10 }}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)', marginBottom: 4 }}>{route.routeName || `${n1.label || '?'} → ${n2.label || '?'}`}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />{n1.label || 'Start'}<span>→</span>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff4d6d', display: 'inline-block' }} />{n2.label || 'End'}
                    </div>
                    {route.threshold1 && (
                      <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4, fontFamily: 'var(--font-mono)', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#00e5a0' }}>T1: {route.threshold1}m</span>
                        <span style={{ color: '#ff4d6d' }}>T2: {route.threshold2}m</span>
                        <span style={{ color: '#4d9fff' }}>T3: {route.threshold3}m</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" style={{ padding: 8 }} onClick={() => setViewModal('routes')}><Eye size={13} /></button>
                    <button className="btn btn-danger btn-sm" style={{ padding: 8 }} onClick={() => deleteRoute(route.id || route.routeId)}><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setModal('area')}><Plus size={14} /> Add Area on Map</button>
            {areas.length > 0 && <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setViewModal('areas')}><Eye size={14} /> View on Map</button>}
          </div>
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
                    {node.label && <div style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={11} /> {node.label}</div>}
                    {area.threshold && <div style={{ fontSize: 11, color: 'var(--blue)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>Radius: {(area.threshold / 1000).toFixed(1)} km</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" style={{ padding: 8 }} onClick={() => setViewModal('areas')}><Eye size={13} /></button>
                    <button className="btn btn-danger btn-sm" style={{ padding: 8 }} onClick={() => deleteArea(area.id || area.areaId)}><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {modal === 'route' && <RouteMapModal loading={actionLoading} onClose={() => setModal(null)} onSave={addRoute} />}
      {modal === 'area' && <AreaMapModal loading={actionLoading} onClose={() => setModal(null)} onSave={addArea} />}
      {viewModal && <ViewMapModal routes={routes} areas={areas} initialTab={viewModal} onClose={() => setViewModal(null)} />}
    </div>
  );
}