import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin, Plus, Trash2, RefreshCw, X, Route, Navigation,
  Circle, CheckCircle, Crosshair, ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ridersAPI } from '../services/api';
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

/* ─── Route Map Modal ────────────────────────────────────────────────────── */
function RouteMapModal({ onClose, onSave, loading }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const directionsRendererRef = useRef(null); // FIX: use DirectionsRenderer for real road route
  const circlesRef = useRef([]);             // FIX: store threshold circles
  const [mapsReady, setMapsReady] = useState(mapsLoaded);
  const [step, setStep] = useState('start'); // 'start' | 'end' | 'confirm'
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [routeName, setRouteName] = useState('');
  const [threshold1, setThreshold1] = useState(500);   // circle around start
  const [threshold2, setThreshold2] = useState(500);   // circle around end
  const [threshold3, setThreshold3] = useState(300);   // circle around waypoints
  const [routeDistance, setRouteDistance] = useState(null); // real road distance
  const [routeDuration, setRouteDuration] = useState(null);
  const [fetchingRoute, setFetchingRoute] = useState(false);
  const [locating, setLocating] = useState(false);
  const geocoder = useRef(null);
  const directionsService = useRef(null);

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

    // FIX: Use DirectionsRenderer to draw real road polyline
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true, // we place our own custom markers
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

  /* ─── FIX: Fetch real road route when both points are set ─────────────── */
  useEffect(() => {
    if (!mapInstance.current || !startPoint || !endPoint || !directionsService.current) return;

    setFetchingRoute(true);
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
          // Fit bounds to route
          const bounds = result.routes[0].bounds;
          mapInstance.current.fitBounds(bounds, 60);
        } else {
          // Fallback: draw a straight dashed line if Directions API fails
          toast.error('Could not fetch road route — showing straight line');
          const poly = new window.google.maps.Polyline({
            path: [startPoint, endPoint],
            strokeColor: '#ffcc00',
            strokeOpacity: 0.7,
            strokeWeight: 3,
            icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 }, offset: '0', repeat: '10px' }],
            map: mapInstance.current,
          });
          // store to clean up later
          circlesRef.current.push({ setMap: (m) => poly.setMap(m) });
        }
      }
    );
  }, [startPoint, endPoint]);

  /* ─── FIX: Draw / update threshold circles whenever thresholds change ─── */
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear old circles
    circlesRef.current.forEach(c => c.setMap(null));
    circlesRef.current = [];

    // T1: circle around START point (green)
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

    // T2: circle around END point (red)
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
    confirm: '✅ Real road route calculated! Enter a name and save.',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(5,8,15,0.95)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Add Route</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
            {fetchingRoute ? '🔄 Calculating road route…' : stepMsg[step]}
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
            color: locating ? 'var(--text-2)' : 'var(--accent)',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}>
            <Crosshair size={18} style={{ animation: locating ? 'ksp 1s linear infinite' : 'none' }} />
          </button>
        )}

        {/* Legend */}
        {mapsReady && (startPoint || endPoint) && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(13,18,32,0.9)', border: '1px solid var(--border-bright)',
            borderRadius: 8, padding: '8px 12px', fontSize: 11,
          }}>
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

        {/* Reset button when points set */}
        {(startPoint || endPoint) && (
          <button onClick={resetPoints} style={{
            position: 'absolute', top: 12, right: 60,
            background: 'rgba(13,18,32,0.9)', border: '1px solid var(--border-bright)',
            borderRadius: 8, padding: '6px 10px',
            color: 'var(--text-2)', cursor: 'pointer', fontSize: 11,
          }}>
            ↩ Reset
          </button>
        )}
      </div>

      {/* Bottom panel */}
      <div style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border)', padding: '16px', flexShrink: 0, overflowY: 'auto', maxHeight: '55vh' }}>
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
          <input
            className="form-input"
            placeholder="e.g. Andheri → Bandra"
            value={routeName}
            onChange={e => setRouteName(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Threshold sliders */}
        <div style={{ marginBottom: 6, fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Threshold Zones
        </div>
        <div style={{ background: 'var(--bg-2)', borderRadius: 8, padding: '10px 12px', marginBottom: 14 }}>
          {[
            {
              label: 'T1 – Start Area',
              desc: 'Circular pickup zone around start point',
              color: '#00e5a0',
              value: threshold1, set: setThreshold1,
            },
            {
              label: 'T2 – End Area',
              desc: 'Circular drop-off zone around end point',
              color: '#ff4d6d',
              value: threshold2, set: setThreshold2,
            },
            {
              label: 'T3 – Waypoint Radius',
              desc: 'Threshold for intermediate checkpoints',
              color: '#4d9fff',
              value: threshold3, set: setThreshold3,
            },
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
              <input
                type="range" min="100" max="5000" step="100"
                value={value}
                onChange={e => set(Number(e.target.value))}
                style={{ width: '100%', accentColor: color }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-2)' }}>
                <span>100m</span><span>5km</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary flex-1"
            onClick={handleSave}
            disabled={loading || !startPoint || !endPoint || !routeName.trim() || fetchingRoute}
          >
            {loading ? 'Saving…' : fetchingRoute ? 'Routing…' : <><CheckCircle size={13} /> Save Route</>}
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
  const [mapsReady, setMapsReady] = useState(mapsLoaded);
  const [center, setCenter] = useState(null);
  const [radius, setRadius] = useState(2000);
  const [areaName, setAreaName] = useState('');
  const [locating, setLocating] = useState(false);
  const geocoder = useRef(null);

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
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(5,8,15,0.95)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
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

      <div style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border)', padding: '16px', flexShrink: 0 }}>
        {center && (
          <div style={{ padding: '10px 12px', background: 'var(--blue-dim)', border: '1px solid rgba(77,159,255,0.25)', borderRadius: 8, marginBottom: 12, fontSize: 12 }}>
            <div style={{ fontWeight: 600, color: 'var(--blue)', marginBottom: 2 }}>📍 Center</div>
            <div style={{ color: 'var(--text-1)' }}>{center.label}</div>
            <div style={{ color: 'var(--text-2)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
              {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
            </div>
          </div>
        )}

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
  const [modal, setModal] = useState(null);

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
