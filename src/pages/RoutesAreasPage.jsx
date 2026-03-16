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
/**
 * Renders a search input that uses Google Places Autocomplete.
 * When a place is selected, calls onPlace({ lat, lng, label }).
 * `placeholder` – hint text shown inside the input.
 * `accentColor`  – colour used for the search icon and suggestions highlight.
 */
function PlaceSearchBox({ onPlace, placeholder = 'Search location…', accentColor = '#00e5a0' }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!window.google?.maps?.places || !inputRef.current) return;
    if (autocompleteRef.current) return; // already initialised

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'in' }, // restrict to India — remove if global needed
      fields: ['geometry', 'name', 'formatted_address', 'address_components'],
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry?.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      // Build a short human-readable label (sublocality → locality → name)
      const comps = place.address_components || [];
      const sub = comps.find(c => c.types.includes('sublocality_level_1') || c.types.includes('sublocality'));
      const loc = comps.find(c => c.types.includes('locality'));
      const label = sub?.long_name || loc?.long_name || place.name || place.formatted_address?.split(',')[0] || '';

      setQuery(place.name || label);
      onPlace({ lat, lng, label: label || place.name });
    });

    return () => {
      // Cleanup: remove PAC dropdown injected by Google
      const pacs = document.querySelectorAll('.pac-container');
      pacs.forEach(el => el.remove());
    };
  }, [onPlace]);

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
          onClick={() => setQuery('')}
          style={{ position: 'absolute', right: 8, background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}

/* ─── Route Map Modal ────────────────────────────────────────────────────── */
function RouteMapModal({ onClose, onSave, loading }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const directionsRendererRef = useRef(null);
  const circlesRef = useRef([]);
  const [mapsReady, setMapsReady] = useState(mapsLoaded);
  const [step, setStep] = useState('start'); // 'start' | 'end' | 'confirm'
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [routeName, setRouteName] = useState('');
  const [threshold1, setThreshold1] = useState(500);
  const [threshold2, setThreshold2] = useState(500);
  const [threshold3, setThreshold3] = useState(300);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [fetchingRoute, setFetchingRoute] = useState(false);
  const [locating, setLocating] = useState(false);
  const [encodedPolyline, setEncodedPolyline] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const geocoder = useRef(null);
  const directionsService = useRef(null);

  // Handle a place selected from the search box
  const handleSearchPlace = useCallback((point, type) => {
    if (!mapInstance.current) return;
    mapInstance.current.setCenter({ lat: point.lat, lng: point.lng });
    mapInstance.current.setZoom(15);
    placeMarker(point.lat, point.lng, type, point.label);
    if (type === 'start') {
      setStartPoint(point);
      setStep(endPoint ? 'confirm' : 'end');
    } else {
      setEndPoint(point);
      setStep('confirm');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endPoint]);

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
      polylineOptions: {
        strokeColor: '#00e5a0',
        strokeOpacity: 0.9,
        strokeWeight: 4,
      },
    });
    directionsRendererRef.current.setMap(map);

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

    getCurrentLocation(map);
  }, [mapsReady]);

  /* ─── FIX: Fetch real road route + capture encoded polyline ──────────── */
  useEffect(() => {
    if (!mapInstance.current || !startPoint || !endPoint || !directionsService.current) return;

    setFetchingRoute(true);
    setEncodedPolyline(''); // reset on new route fetch

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

          // FIX: Extract the Google Encoded Polyline from the Directions result
          // overview_polyline is the encoded string the backend expects
          const overviewPolyline = result.routes[0]?.overview_polyline;
          setEncodedPolyline(overviewPolyline || '');

          const bounds = result.routes[0].bounds;
          mapInstance.current.fitBounds(bounds, 60);
        } else {
          toast.error('Could not fetch road route — showing straight line');
          // Fallback: generate a simple encoded polyline for the two points
          // so the backend still receives a valid encoding field
          if (window.google.maps.geometry?.encoding) {
            const fallbackPath = [
              new window.google.maps.LatLng(startPoint.lat, startPoint.lng),
              new window.google.maps.LatLng(endPoint.lat, endPoint.lng),
            ];
            const fallbackEncoded = window.google.maps.geometry.encoding.encodePath(fallbackPath);
            setEncodedPolyline(fallbackEncoded);
          }

          const poly = new window.google.maps.Polyline({
            path: [startPoint, endPoint],
            strokeColor: '#ffcc00',
            strokeOpacity: 0.7,
            strokeWeight: 3,
            icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 }, offset: '0', repeat: '10px' }],
            map: mapInstance.current,
          });
          circlesRef.current.push({ setMap: (m) => poly.setMap(m) });
        }
      }
    );
  }, [startPoint, endPoint]);

  /* ─── Draw / update threshold circles ───────────────────────────────── */
  useEffect(() => {
    if (!mapInstance.current) return;

    circlesRef.current.forEach(c => c.setMap(null));
    circlesRef.current = [];

    if (startPoint) {
      const c1 = new window.google.maps.Circle({
        center: { lat: startPoint.lat, lng: startPoint.lng },
        radius: threshold1,
        strokeColor: '#00e5a0',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#00e5a0',
        fillOpacity: 0.08,
        map: mapInstance.current,
      });
      circlesRef.current.push(c1);
    }

    if (endPoint) {
      const c2 = new window.google.maps.Circle({
        center: { lat: endPoint.lat, lng: endPoint.lng },
        radius: threshold2,
        strokeColor: '#ff4d6d',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#ff4d6d',
        fillOpacity: 0.08,
        map: mapInstance.current,
      });
      circlesRef.current.push(c2);
    }
  }, [startPoint, endPoint, threshold1, threshold2]);

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
      (pos) => { map.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }); map.setZoom(15); },
      () => {},
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const placeMarker = (lat, lng, type, label) => {
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
    const iw = new window.google.maps.InfoWindow({
      content: `<div style="color:#0d1220;font-size:12px;font-weight:600;">${isStart ? '🟢 Start' : '🔴 End'}: ${label}</div>`,
    });
    marker.addListener('click', () => iw.open(mapInstance.current, marker));
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
    circlesRef.current.forEach(c => c.setMap(null));
    circlesRef.current = [];
    if (directionsRendererRef.current) directionsRendererRef.current.setDirections({ routes: [] });
    setStartPoint(null);
    setEndPoint(null);
    setRouteDistance(null);
    setRouteDuration(null);
    setEncodedPolyline(''); // FIX: reset encoding on reset
    setStep('start');
  };

  const handleSave = () => {
    if (!startPoint || !endPoint) { toast.error('Set both start and end points'); return; }
    if (!routeName.trim()) { toast.error('Enter a route name'); return; }
    // FIX: guard — encoding must be present before saving
    if (!encodedPolyline) { toast.error('Route encoding not ready yet, please wait'); return; }

    // FIX: include `encoding` in the payload sent to the backend
    onSave({
      routeName: routeName.trim(),
      encoding: encodedPolyline,
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
    confirm: '✅ Real road route calculated! Enter a name and save.',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', background: '#05080f' }}>

      {/* ── Top: Search header ── */}
      <div style={{ flexShrink: 0, background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', padding: '12px 16px 14px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Add Route</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
              {fetchingRoute ? '🔄 Calculating road route…' : stepMsg[step]}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border)', color: 'var(--text-1)', cursor: 'pointer', padding: 8, borderRadius: 8, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>
        {mapsReady && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: '#00e5a0', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: 4, letterSpacing: '0.06em' }}>🟢 START POINT</div>
              <PlaceSearchBox placeholder="Search start location…" accentColor="#00e5a0" onPlace={(p) => handleSearchPlace(p, 'start')} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#ff4d6d', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: 4, letterSpacing: '0.06em' }}>🔴 END POINT</div>
              <PlaceSearchBox placeholder="Search end location…" accentColor="#ff4d6d" onPlace={(p) => handleSearchPlace(p, 'end')} />
            </div>
          </div>
        )}
      </div>

      {/* ── Middle: Map ── */}
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
            color: locating ? 'var(--text-2)' : 'var(--accent)',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}>
            <Crosshair size={18} style={{ animation: locating ? 'ksp 1s linear infinite' : 'none' }} />
          </button>
        )}

        {/* Legend */}
        {mapsReady && (startPoint || endPoint) && (
          <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(13,18,32,0.92)', border: '1px solid var(--border-bright)', borderRadius: 8, padding: '8px 12px', fontSize: 11 }}>
            {startPoint && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: endPoint ? 4 : 0 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e5a0', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-1)' }}>{startPoint.label}</span>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>T1: {threshold1}m</span>
              </div>
            )}
            {endPoint && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4d6d', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-1)' }}>{endPoint.label}</span>
                <span style={{ color: '#ff4d6d', fontFamily: 'var(--font-mono)' }}>T2: {threshold2}m</span>
              </div>
            )}
            {routeDistance && (
              <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid var(--border)', color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                🛣 {routeDistance} · {routeDuration}
              </div>
            )}
          </div>
        )}

        {/* Reset */}
        {(startPoint || endPoint) && (
          <button onClick={resetPoints} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(13,18,32,0.92)', border: '1px solid var(--border-bright)', borderRadius: 8, padding: '6px 10px', color: 'var(--text-2)', cursor: 'pointer', fontSize: 11 }}>
            ↩ Reset
          </button>
        )}
      </div>

      {/* ── Bottom Sheet ── */}
      <div style={{ flexShrink: 0, background: 'var(--bg-1)', borderTop: '1px solid var(--border)', borderRadius: '20px 20px 0 0', boxShadow: '0 -4px 24px rgba(0,0,0,0.5)', transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)', maxHeight: sheetOpen ? '60vh' : '36px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Drag handle — tap to toggle */}
        <div onClick={() => setSheetOpen(o => !o)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 0', flexShrink: 0, cursor: 'pointer', userSelect: 'none' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: sheetOpen ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)', transition: 'background 0.2s' }} />
        </div>

        {/* Scrollable form — only visible when open */}
        <div style={{ overflowY: 'auto', overscrollBehavior: 'contain', padding: '0 16px 28px', flex: 1 }}>
          {/* Points summary */}
          {startPoint && endPoint && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {[
                { label: '🟢 Start', point: startPoint, color: 'var(--accent)' },
                { label: '🔴 End', point: endPoint, color: '#ff4d6d' },
              ].map(({ label, point, color }) => (
                <div key={label} style={{ padding: '8px 10px', background: 'var(--bg-2)', border: `1px solid ${color}33`, borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color, fontWeight: 700, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-1)' }}>{point.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                    {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Route Name */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Route Name *
            </label>
            <input className="form-input" placeholder="e.g. Andheri → Bandra" value={routeName} onChange={e => setRouteName(e.target.value)} style={{ width: '100%' }} />
          </div>

          {/* Threshold sliders */}
          <div style={{ marginBottom: 6, fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Threshold Zones</div>
          <div style={{ background: 'var(--bg-2)', borderRadius: 8, padding: '10px 12px', marginBottom: 14 }}>
            {[
              { label: 'T1 – Start Area', desc: 'Circular pickup zone around start point', color: '#00e5a0', value: threshold1, set: setThreshold1 },
              { label: 'T2 – End Area', desc: 'Circular drop-off zone around end point', color: '#ff4d6d', value: threshold2, set: setThreshold2 },
              { label: 'T3 – Waypoint Radius', desc: 'Threshold for intermediate checkpoints', color: '#4d9fff', value: threshold3, set: setThreshold3 },
            ].map(({ label, desc, color, value, set }) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color }}>{label}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-2)' }}>{desc}</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: 'var(--font-mono)', alignSelf: 'flex-start', marginTop: 2 }}>
                    {value >= 1000 ? `${(value / 1000).toFixed(1)}km` : `${value}m`}
                  </span>
                </div>
                <input type="range" min="100" max="5000" step="100" value={value} onChange={e => set(Number(e.target.value))} style={{ width: '100%', accentColor: color }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-2)' }}>
                  <span>100m</span><span>5km</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary flex-1" onClick={handleSave} disabled={loading || !startPoint || !endPoint || !routeName.trim() || fetchingRoute || !encodedPolyline}>
              {loading ? 'Saving…' : fetchingRoute ? 'Routing…' : <><CheckCircle size={13} /> Save Route</>}
            </button>
          </div>
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
  const [mapsReady, setMapsReady] = useState(mapsLoaded);
  const [center, setCenter] = useState(null);
  const [radius, setRadius] = useState(2000);
  const [areaName, setAreaName] = useState('');
  const [locating, setLocating] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const geocoder = useRef(null);

  // Handle place selected from search
  const handleSearchPlace = useCallback((point) => {
    if (!mapInstance.current) return;
    mapInstance.current.setCenter({ lat: point.lat, lng: point.lng });
    mapInstance.current.setZoom(14);
    placeCenter(point.lat, point.lng, point.label);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      center: DEFAULT_CENTER, zoom: 12,
      styles: DARK_STYLE, disableDefaultUI: true, zoomControl: true, gestureHandling: 'greedy',
    });
    mapInstance.current = map;
    geocoder.current = new window.google.maps.Geocoder();

    map.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
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

  const placeCenter = (lat, lng, label) => {
    setCenter({ lat, lng, label });
    updateCircle(lat, lng, radius);
  };

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
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', background: '#05080f' }}>

      {/* ── Top: Search header ── */}
      <div style={{ flexShrink: 0, background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', padding: '12px 16px 14px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Add Delivery Area</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
              {center ? '✅ Area set! Adjust radius and save.' : '📍 Search or tap map to set area center'}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border)', color: 'var(--text-1)', cursor: 'pointer', padding: 8, borderRadius: 8, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>
        {mapsReady && (
          <PlaceSearchBox placeholder="Search area location…" accentColor="#4d9fff" onPlace={handleSearchPlace} />
        )}
      </div>

      {/* ── Middle: Map ── */}
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

        {/* Legend */}
        {mapsReady && center && (
          <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(13,18,32,0.92)', border: '1px solid var(--border-bright)', borderRadius: 8, padding: '8px 12px', fontSize: 11 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4d9fff', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-1)' }}>{center.label}</span>
            </div>
            <div style={{ color: 'var(--text-2)', marginTop: 2 }}>{(radius / 1000).toFixed(1)} km radius</div>
          </div>
        )}
      </div>

      {/* ── Bottom Sheet ── */}
      <div style={{ flexShrink: 0, background: 'var(--bg-1)', borderTop: '1px solid var(--border)', borderRadius: '20px 20px 0 0', boxShadow: '0 -4px 24px rgba(0,0,0,0.5)', transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)', maxHeight: sheetOpen ? '60vh' : '36px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Drag handle — tap to toggle */}
        <div onClick={() => setSheetOpen(o => !o)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 0', flexShrink: 0, cursor: 'pointer', userSelect: 'none' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: sheetOpen ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)', transition: 'background 0.2s' }} />
        </div>

        {/* Scrollable form — only visible when open */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-2)' }}>
              <span>0.5 km</span><span>20 km</span>
            </div>
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
/**
 * Read-only map showing all of a rider's registered routes and areas.
 *
 * Routes  — decoded from Google Encoded Polyline (`encoding` field), drawn as
 *           a coloured polyline.  T1 circle (start), T2 circle (end), T3
 *           corridor circles along the middle waypoints are also shown.
 * Areas   — drawn as a circle centred on `node` with radius `threshold`.
 *
 * The rider can tap a route/area chip at the top to isolate it on the map,
 * or tap "All" to see everything at once.
 */
function ViewMapModal({ routes, areas, onClose, initialTab }) {
  const mapRef       = useRef(null);
  const mapInstance  = useRef(null);
  const overlaysRef  = useRef([]);           // all map overlays (polylines, circles, markers)
  const [mapsReady, setMapsReady]   = useState(mapsLoaded);
  const [activeTab,  setActiveTab]  = useState(initialTab || 'routes');
  const [selectedId, setSelectedId] = useState('all');
  const [legendItems, setLegendItems] = useState([]);

  /* ── Load Google Maps ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!MAPS_API_KEY) return;
    loadGoogleMaps(MAPS_API_KEY)
      .then(() => setMapsReady(true))
      .catch(() => toast.error('Failed to load Google Maps'));
  }, []);

  /* ── Initialise map ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!mapsReady || !mapRef.current || mapInstance.current) return;
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: DEFAULT_CENTER, zoom: 12,
      styles: DARK_STYLE, disableDefaultUI: true, zoomControl: true,
      gestureHandling: 'greedy',
    });
    // After map is ready, draw
    drawOverlays(activeTab, selectedId);
  }, [mapsReady]);

  /* ── Re-draw whenever selection changes ──────────────────────────── */
  useEffect(() => {
    if (!mapInstance.current) return;
    drawOverlays(activeTab, selectedId);
  }, [activeTab, selectedId, routes, areas]);

  /* ── Colours per index ────────────────────────────────────────────── */
  const ROUTE_COLOURS = ['#00e5a0', '#ffcc00', '#ff6b6b', '#b388ff', '#40c8e0'];
  const AREA_COLOURS  = ['#4d9fff', '#ff9f43', '#ee5a24', '#a29bfe', '#55efc4'];

  /* ── Clear all overlays ───────────────────────────────────────────── */
  const clearOverlays = () => {
    overlaysRef.current.forEach(o => o.setMap(null));
    overlaysRef.current = [];
  };

  /* ── Draw everything ──────────────────────────────────────────────── */
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
        const n1 = route.node1 || {};
        const n2 = route.node2 || {};

        /* ── Decode polyline ── */
        let decodedPath = [];
        if (route.encoding && window.google.maps.geometry?.encoding) {
          try {
            decodedPath = window.google.maps.geometry.encoding.decodePath(route.encoding);
          } catch (_) {}
        }
        // Fallback: straight line between node1 and node2
        if (decodedPath.length < 2 && n1.latitude && n2.latitude) {
          decodedPath = [
            new window.google.maps.LatLng(n1.latitude, n1.longitude),
            new window.google.maps.LatLng(n2.latitude, n2.longitude),
          ];
        }

        if (decodedPath.length >= 2) {
          /* Route polyline */
          const poly = new window.google.maps.Polyline({
            path: decodedPath,
            strokeColor: color,
            strokeOpacity: 0.85,
            strokeWeight: 4,
            map: mapInstance.current,
          });
          overlaysRef.current.push(poly);
          decodedPath.forEach(p => bounds.extend(p));
          hasPoints = true;

          /* T3 corridor circles along middle waypoints */
          if (route.threshold3 && decodedPath.length > 2) {
            const step = Math.max(1, Math.floor(decodedPath.length / 8));
            for (let i = step; i < decodedPath.length - step; i += step) {
              const cc = new window.google.maps.Circle({
                center: { lat: decodedPath[i].lat(), lng: decodedPath[i].lng() },
                radius: route.threshold3,
                strokeColor: color, strokeOpacity: 0.15, strokeWeight: 1,
                fillColor: color, fillOpacity: 0.04,
                map: mapInstance.current,
              });
              overlaysRef.current.push(cc);
            }
          }

          /* T1 circle – start */
          if (n1.latitude && route.threshold1) {
            const c1 = new window.google.maps.Circle({
              center: { lat: n1.latitude, lng: n1.longitude },
              radius: route.threshold1,
              strokeColor: color, strokeOpacity: 0.6, strokeWeight: 2,
              fillColor: color, fillOpacity: 0.1,
              map: mapInstance.current,
            });
            overlaysRef.current.push(c1);
          }

          /* T2 circle – end */
          if (n2.latitude && route.threshold2) {
            const c2 = new window.google.maps.Circle({
              center: { lat: n2.latitude, lng: n2.longitude },
              radius: route.threshold2,
              strokeColor: '#ff4d6d', strokeOpacity: 0.6, strokeWeight: 2,
              fillColor: '#ff4d6d', fillOpacity: 0.1,
              map: mapInstance.current,
            });
            overlaysRef.current.push(c2);
          }

          /* Start marker */
          if (n1.latitude) {
            const sm = new window.google.maps.Marker({
              position: { lat: n1.latitude, lng: n1.longitude },
              map: mapInstance.current,
              title: n1.label || 'Start',
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 9, fillColor: color, fillOpacity: 1,
                strokeColor: '#fff', strokeWeight: 2,
              },
            });
            const iw = new window.google.maps.InfoWindow({
              content: `<div style="color:#0d1220;font-size:12px;font-weight:600;">🟢 ${n1.label || 'Start'}</div>`,
            });
            sm.addListener('click', () => iw.open(mapInstance.current, sm));
            overlaysRef.current.push(sm);
          }

          /* End marker */
          if (n2.latitude) {
            const em = new window.google.maps.Marker({
              position: { lat: n2.latitude, lng: n2.longitude },
              map: mapInstance.current,
              title: n2.label || 'End',
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 9, fillColor: '#ff4d6d', fillOpacity: 1,
                strokeColor: '#fff', strokeWeight: 2,
              },
            });
            const iw2 = new window.google.maps.InfoWindow({
              content: `<div style="color:#0d1220;font-size:12px;font-weight:600;">🔴 ${n2.label || 'End'}</div>`,
            });
            em.addListener('click', () => iw2.open(mapInstance.current, em));
            overlaysRef.current.push(em);
          }
        }

        newLegend.push({
          id: route.id || route.routeId,
          label: route.routeName || `${n1.label || '?'} → ${n2.label || '?'}`,
          color,
          sub: route.threshold1 ? `T1:${route.threshold1}m · T2:${route.threshold2}m · T3:${route.threshold3}m` : '',
        });
      });
    } else {
      /* Areas */
      const list = selId === 'all' ? areas : areas.filter(a => (a.id || a.areaId) === selId);
      list.forEach((area, idx) => {
        const color = AREA_COLOURS[idx % AREA_COLOURS.length];
        const node = area.node || {};
        if (!node.latitude) return;

        const circle = new window.google.maps.Circle({
          center: { lat: node.latitude, lng: node.longitude },
          radius: area.threshold || 2000,
          strokeColor: color, strokeOpacity: 0.8, strokeWeight: 2,
          fillColor: color, fillOpacity: 0.12,
          map: mapInstance.current,
        });
        overlaysRef.current.push(circle);
        bounds.union(circle.getBounds());
        hasPoints = true;

        const marker = new window.google.maps.Marker({
          position: { lat: node.latitude, lng: node.longitude },
          map: mapInstance.current,
          title: area.areaName || area.name || 'Area',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8, fillColor: color, fillOpacity: 1,
            strokeColor: '#fff', strokeWeight: 2,
          },
        });
        const iw = new window.google.maps.InfoWindow({
          content: `<div style="color:#0d1220;font-size:12px;font-weight:600;">📍 ${area.areaName || area.name || 'Area'}<br/><span style="font-weight:400;font-size:11px;">Radius: ${((area.threshold || 2000) / 1000).toFixed(1)} km</span></div>`,
        });
        marker.addListener('click', () => iw.open(mapInstance.current, marker));
        overlaysRef.current.push(marker);

        newLegend.push({
          id: area.id || area.areaId,
          label: area.areaName || area.name || 'Area',
          color,
          sub: area.threshold ? `${((area.threshold) / 1000).toFixed(1)} km radius` : '',
        });
      });
    }

    setLegendItems(newLegend);
    if (hasPoints && !bounds.isEmpty()) {
      mapInstance.current.fitBounds(bounds, 60);
    }
  };

  const activeItems = activeTab === 'routes' ? routes : areas;
  const hasData = activeItems.length > 0;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(5,8,15,0.97)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Layers size={18} style={{ color: 'var(--accent)' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>My Coverage Map</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Tap a route or area chip to highlight it</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-1)', cursor: 'pointer', padding: 4 }}>
          <X size={18} />
        </button>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 16px 0', background: 'var(--bg-1)', flexShrink: 0 }}>
        {[
          { key: 'routes', label: `🛣 Routes (${routes.length})` },
          { key: 'areas',  label: `📍 Areas (${areas.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => { setActiveTab(t.key); setSelectedId('all'); }}
            style={{
              padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600,
              background: activeTab === t.key ? 'var(--accent)' : 'var(--bg-2)',
              color: activeTab === t.key ? '#000' : 'var(--text-2)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Filter chips */}
      {hasData && (
        <div style={{
          display: 'flex', gap: 6, padding: '8px 16px', overflowX: 'auto',
          background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', flexShrink: 0,
        }}>
          <button
            onClick={() => setSelectedId('all')}
            style={{
              flexShrink: 0, padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 600,
              background: selectedId === 'all' ? 'var(--accent)' : 'var(--bg-2)',
              color: selectedId === 'all' ? '#000' : 'var(--text-2)',
            }}>
            All
          </button>
          {activeItems.map((item, idx) => {
            const id = item.id || item.routeId || item.areaId;
            const label = item.routeName || item.areaName || item.name || `#${idx + 1}`;
            const colors = activeTab === 'routes' ? ROUTE_COLOURS : AREA_COLOURS;
            const color = colors[idx % colors.length];
            const isSelected = selectedId === id;
            return (
              <button key={id} onClick={() => setSelectedId(isSelected ? 'all' : id)}
                style={{
                  flexShrink: 0, padding: '4px 12px', borderRadius: 20, border: `1.5px solid ${color}`,
                  cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  background: isSelected ? color : 'transparent',
                  color: isSelected ? '#000' : color,
                }}>
                {label}
              </button>
            );
          })}
        </div>
      )}

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
        ) : !hasData ? (
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg-2)' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-2)', padding: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }}>{activeTab === 'routes' ? '🛣' : '📍'}</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                No {activeTab === 'routes' ? 'routes' : 'areas'} registered
              </div>
              <div style={{ fontSize: 12 }}>Add {activeTab === 'routes' ? 'a route' : 'an area'} first</div>
            </div>
          </div>
        ) : (
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        )}

        {/* Legend overlay */}
        {mapsReady && hasData && legendItems.length > 0 && (
          <div style={{
            position: 'absolute', bottom: 16, left: 12,
            background: 'rgba(13,18,32,0.92)', border: '1px solid var(--border-bright)',
            borderRadius: 10, padding: '8px 12px', maxWidth: 'calc(100vw - 24px)',
            overflowX: 'auto',
          }}>
            {legendItems.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: legendItems.length > 1 ? 6 : 0 }}>
                <span style={{
                  width: activeTab === 'routes' ? 18 : 10, height: activeTab === 'routes' ? 3 : 10,
                  borderRadius: activeTab === 'routes' ? 2 : '50%',
                  background: item.color, display: 'inline-block', flexShrink: 0,
                  marginTop: activeTab === 'routes' ? 7 : 4,
                  border: activeTab === 'areas' ? `2px solid ${item.color}` : 'none',
                }} />
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
  const [viewModal, setViewModal] = useState(null); // null | 'routes' | 'areas'

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
      // ── Service Area Pre-validation ───────────────────────────────────
      try {
        const { data: saData } = await serviceAreaAPI.validate(
          form.node1.latitude, form.node1.longitude,
          form.node2.latitude, form.node2.longitude,
        );
        if (!saData.data.bothServiced) {
          toast.error(saData.data.failReason || 'Route start or end point is outside active service areas. Contact admin to expand coverage.', { duration: 6000 });
          setActionLoading(false);
          return;
        }
      } catch {
        // If validation endpoint fails, let backend handle it
      }
      // ── Proceed with registration ─────────────────────────────────────
      await ridersAPI.addRoute(user.uid, form);
      toast.success('Route added!');
      setModal(null);
      try { await fetchData(); } catch { /* index may not exist yet, list will refresh on next load */ }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add route');
    } finally { setActionLoading(false); }
  };

  const deleteRoute = async (routeId) => {
    if (!window.confirm('Delete this route?')) return;
    // Optimistically remove from UI immediately
    setRoutes(prev => prev.filter(r => (r.id || r.routeId) !== routeId));
    try {
      await ridersAPI.deleteRoute(user.uid, routeId);
      toast.success('Route deleted');
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
      await fetchData(); // restore accurate state on error
    }
  };

  const addArea = async (form) => {
    setActionLoading(true);
    try {
      // ── Service Area Pre-validation ───────────────────────────────────
      try {
        const { data: saData } = await serviceAreaAPI.validateArea(
          form.node.latitude,
          form.node.longitude,
        );
        if (!saData.data.serviced) {
          toast.error(
            saData.data.failReason ||
            'The selected area is outside active service zones. Contact admin to expand coverage.',
            { duration: 6000 },
          );
          setActionLoading(false);
          return;
        }
      } catch {
        // If the validation endpoint fails, let the backend handle it
      }
      // ── Proceed with registration ─────────────────────────────────────
      await ridersAPI.addArea(user.uid, form);
      toast.success('Area added!');
      setModal(null);
      try { await fetchData(); } catch { /* index may not exist yet, list will refresh on next load */ }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add area');
    } finally { setActionLoading(false); }
  };

  const deleteArea = async (areaId) => {
    if (!window.confirm('Delete this area?')) return;
    // Optimistically remove from UI immediately
    setAreas(prev => prev.filter(a => (a.id || a.areaId) !== areaId));
    try {
      await ridersAPI.deleteArea(user.uid, areaId);
      toast.success('Area deleted');
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
      await fetchData(); // restore accurate state on error
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
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setModal('route')}>
              <Plus size={14} /> Add Route on Map
            </button>
            {routes.length > 0 && (
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setViewModal('routes')}>
                <Eye size={14} /> View on Map
              </button>
            )}
          </div>
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
                      <span>→</span>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff4d6d', display: 'inline-block' }} />
                      {n2.label || 'End'}
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
                    <button className="btn btn-ghost btn-sm" style={{ padding: 8 }}
                      onClick={() => { setViewModal('routes'); }}>
                      <Eye size={13} />
                    </button>
                    <button className="btn btn-danger btn-sm" style={{ padding: 8 }}
                      onClick={() => deleteRoute(route.id || route.routeId)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setModal('area')}>
              <Plus size={14} /> Add Area on Map
            </button>
            {areas.length > 0 && (
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setViewModal('areas')}>
                <Eye size={14} /> View on Map
              </button>
            )}
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
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" style={{ padding: 8 }}
                      onClick={() => setViewModal('areas')}>
                      <Eye size={13} />
                    </button>
                    <button className="btn btn-danger btn-sm" style={{ padding: 8 }}
                      onClick={() => deleteArea(area.id || area.areaId)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}

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
      {viewModal && (
        <ViewMapModal
          routes={routes}
          areas={areas}
          initialTab={viewModal}
          onClose={() => setViewModal(null)}
        />
      )}
    </div>
  );
}