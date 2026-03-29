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

  /* ─── Helper: map T3 radius (50–2000 m) → stroke weight (2–14 px) ────────── */
  function t3ToStrokeWeight(t3) {
    const minT3 = 50, maxT3 = 2000;
    const minW = 2, maxW = 14;
    const clamped = Math.min(maxT3, Math.max(minT3, t3));
    return minW + ((clamped - minT3) / (maxT3 - minT3)) * (maxW - minW);
  }

  /* ─── Touch-friendly Slider ──────────────────────────────────────────────── */
  function TouchSlider({ value, onChange, min = 100, max = 5000, step = 50, accentColor = '#00e5a0', label }) {
    const trackRef = useRef(null);
    const isDragging = useRef(false);

    const clamp = (v) => Math.min(max, Math.max(min, v));
    const snap = (v) => Math.round((v - min) / step) * step + min;

    const posToValue = (clientX) => {
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return snap(clamp(min + pct * (max - min)));
    };

    const handlePointerDown = (e) => {
      e.preventDefault();
      isDragging.current = true;
      trackRef.current.setPointerCapture(e.pointerId);
      onChange(posToValue(e.clientX));
    };

    const handlePointerMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      onChange(posToValue(e.clientX));
    };

    const handlePointerUp = () => { isDragging.current = false; };

    const pct = ((value - min) / (max - min)) * 100;
    const display = value >= 1000 ? `${(value / 1000).toFixed(1)} km` : `${value} m`;

    return (
      <div style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
        {label && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: accentColor, boxShadow: `0 0 6px ${accentColor}` }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: accentColor, letterSpacing: '0.08em' }}>{label}</span>
            </div>
            <span style={{
              fontSize: 12, fontWeight: 700, color: accentColor,
              background: `${accentColor}18`, border: `1px solid ${accentColor}44`,
              borderRadius: 7, padding: '2px 9px', fontFamily: 'monospace',
            }}>{display}</span>
          </div>
        )}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            position: 'relative', height: 44,
            display: 'flex', alignItems: 'center',
            cursor: 'pointer', touchAction: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <div style={{ position: 'absolute', left: 0, right: 0, height: 5, borderRadius: 3, background: '#2a2e2a' }} />
          <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${accentColor}77, ${accentColor})`, pointerEvents: 'none' }} />
          <div style={{
            position: 'absolute', left: `calc(${pct}% - 14px)`,
            width: 28, height: 28, borderRadius: '50%',
            background: accentColor, border: '3px solid #141714',
            boxShadow: `0 2px 12px ${accentColor}99`,
            pointerEvents: 'none',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <span style={{ fontSize: 10, color: '#556', fontFamily: 'monospace' }}>{min >= 1000 ? `${min / 1000}km` : `${min}m`}</span>
          <span style={{ fontSize: 10, color: '#556', fontFamily: 'monospace' }}>{max >= 1000 ? `${max / 1000}km` : `${max}m`}</span>
        </div>
      </div>
    );
  }

  /* ─── Reusable Place Search Box ──────────────────────────────────────────── */
  function PlaceSearchBox({ onSelect, placeholder = 'Search location…', accentColor = '#00e5a0' }) {
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const pacContainerRef = useRef(null);
    const [query, setQuery] = useState('');
    const onSelectRef = useRef(onSelect);
    useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

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
        setQuery(place.name || label);
        onSelectRef.current({ lat, lng, label: label || place.name, fullAddress: place.formatted_address || label });
      });
      return () => {
        if (pacContainerRef.current) { pacContainerRef.current.remove(); pacContainerRef.current = null; }
      };
    }, []);

    return (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search size={14} style={{ position: 'absolute', left: 10, color: accentColor, pointerEvents: 'none' }} />
        <input
          ref={inputRef}
          type="text"
          className="form-input"
          placeholder={placeholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ width: '100%', paddingLeft: 32, fontSize: 13, background: '#141714', border: `1px solid ${accentColor}33`, color: '#e0e0d8' }}
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); if (inputRef.current) inputRef.current.focus(); }}
            style={{ position: 'absolute', right: 8, background: 'none', border: 'none', color: '#556', cursor: 'pointer', padding: 2, display: 'flex' }}
          >
            <X size={13} />
          </button>
        )}
      </div>
    );
  }

  /* ─── Route Map Modal — Center-Pin UX ───────────────────────────────────── */
  function RouteMapModal({ onClose, onSave, loading }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const geocoder = useRef(null);
    const directionsService = useRef(null);
    const directionsRenderer = useRef(null);
    const markersRef = useRef([]);
    const circlesRef = useRef([]);
    const geocodeTimer = useRef(null);

    const [mapsReady, setMapsReady] = useState(mapsLoaded);
    // step 1 = pick start, step 2 = pick end, step 3 = details/save
    const [step, setStep] = useState(1);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);

    // Center-pin address state
    const [centerAddress, setCenterAddress] = useState('Move the map to select location');
    const [centerCoords, setCenterCoords] = useState(DEFAULT_CENTER);
    const [isDragging, setIsDragging] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);

    // Route details
    const routeNameRef = useRef(null);
    // ── CHANGE: track whether user has manually edited the route name ──
    const routeNameUserEdited = useRef(false);

    const [threshold1, setThreshold1] = useState(500);
    const [threshold2, setThreshold2] = useState(500);
    const [threshold3, setThreshold3] = useState(300);
    const [routeDistance, setRouteDistance] = useState(null);
    const [routeDuration, setRouteDuration] = useState(null);
    const [fetchingRoute, setFetchingRoute] = useState(false);
    const [encodedPolyline, setEncodedPolyline] = useState('');
    const [locating, setLocating] = useState(false);

    const accent = '#00e5a0';
    const endColor = '#ff6b6b';
    const isPickingStep = step === 1 || step === 2;
    const pinColor = step === 1 ? accent : endColor;
    const pinLabel = step === 1 ? 'START POINT' : 'END POINT';

    /* Load maps */
    useEffect(() => {
      if (!MAPS_API_KEY) return;
      loadGoogleMaps(MAPS_API_KEY).then(() => setMapsReady(true)).catch(() => toast.error('Failed to load Maps'));
    }, []);

    /* Init map */
    useEffect(() => {
      if (!mapsReady || !mapRef.current || mapInstance.current) return;
      const map = new window.google.maps.Map(mapRef.current, {
        center: DEFAULT_CENTER, zoom: 14,
        styles: DARK_STYLE, disableDefaultUI: true,
        gestureHandling: 'greedy',
      });
      mapInstance.current = map;
      geocoder.current = new window.google.maps.Geocoder();
      directionsService.current = new window.google.maps.DirectionsService();
      directionsRenderer.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: accent,
          strokeOpacity: 0.9,
          // ── CHANGE: initial stroke weight from current threshold3 ──
          strokeWeight: t3ToStrokeWeight(300),
        },
      });
      directionsRenderer.current.setMap(map);

      /* Reverse-geocode on every center change (debounced) */
      map.addListener('center_changed', () => {
        const c = map.getCenter();
        const coords = { lat: c.lat(), lng: c.lng() };
        setCenterCoords(coords);
        clearTimeout(geocodeTimer.current);
        setCenterAddress('Locating…');
        geocodeTimer.current = setTimeout(() => doReverseGeocode(coords.lat, coords.lng), 500);
      });

      map.addListener('dragstart', () => setIsDragging(true));
      map.addListener('dragend', () => setIsDragging(false));
      map.addListener('idle', () => setIsDragging(false));

      /* Try geolocation for better starting position */
      if (navigator.geolocation) {
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            map.setCenter(c);
            map.setZoom(15);
            setCenterCoords(c);
            setLocating(false);
          },
          () => {
            setLocating(false);
            doReverseGeocode(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
          },
          { enableHighAccuracy: true, timeout: 6000 }
        );
      } else {
        doReverseGeocode(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
      }
    }, [mapsReady]);

    /* ── CHANGE: Update polyline stroke weight whenever threshold3 changes ── */
    useEffect(() => {
      if (!directionsRenderer.current) return;
      const newWeight = t3ToStrokeWeight(threshold3);
      // Re-set the directions with updated polyline options
      directionsRenderer.current.setOptions({
        polylineOptions: {
          strokeColor: accent,
          strokeOpacity: 0.9,
          strokeWeight: newWeight,
        },
      });
    }, [threshold3]);

    const doReverseGeocode = (lat, lng) => {
      if (!geocoder.current) { setCenterAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`); return; }
      setIsGeocoding(true);
      geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
        setIsGeocoding(false);
        if (status === 'OK' && results[0]) {
          const parts = results[0].address_components;
          const sub = parts.find(p => p.types.includes('sublocality_level_1') || p.types.includes('sublocality'));
          const loc = parts.find(p => p.types.includes('locality'));
          const name = sub?.long_name || loc?.long_name || results[0].formatted_address.split(',')[0];
          setCenterAddress(name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } else {
          setCenterAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
      });
    };

    /* When user picks a place from search: pan map there */
    const handleSearchSelect = useCallback((point) => {
      if (!mapInstance.current) return;
      mapInstance.current.setCenter({ lat: point.lat, lng: point.lng });
      mapInstance.current.setZoom(15);
      setCenterCoords({ lat: point.lat, lng: point.lng });
      setCenterAddress(point.label || point.fullAddress || 'Selected location');
    }, []);

    const handleLocateMe = () => {
      if (!navigator.geolocation || !mapInstance.current) return;
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          mapInstance.current.setCenter(c);
          mapInstance.current.setZoom(15);
          setCenterCoords(c);
          setLocating(false);
        },
        () => { setLocating(false); toast.error('Location access denied'); },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    };

    const placeMarker = (pt, type) => {
      markersRef.current = markersRef.current.filter(m => {
        if (m._type === type) { m.setMap(null); return false; }
        return true;
      });
      const color = type === 'start' ? accent : endColor;
      const m = new window.google.maps.Marker({
        position: { lat: pt.lat, lng: pt.lng },
        map: mapInstance.current,
        title: pt.label,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12, fillColor: color, fillOpacity: 1,
          strokeColor: '#fff', strokeWeight: 3,
        },
        zIndex: 10,
      });
      m._type = type;
      markersRef.current.push(m);
    };

    /* Confirm whichever point we're currently picking */
    const handleConfirmPoint = () => {
      const pt = { lat: centerCoords.lat, lng: centerCoords.lng, label: centerAddress };
      if (step === 1) {
        setStartPoint(pt);
        placeMarker(pt, 'start');
        setStep(2);
      } else if (step === 2) {
        setEndPoint(pt);
        placeMarker(pt, 'end');
        setStep(3);
      }
    };

    /* Edit a previously set point */
    const handleEditPoint = (type) => {
      if (type === 'start') {
        setStartPoint(null);
        markersRef.current.filter(m => m._type === 'start').forEach(m => m.setMap(null));
        markersRef.current = markersRef.current.filter(m => m._type !== 'start');
        if (directionsRenderer.current) directionsRenderer.current.setDirections({ routes: [] });
        setRouteDistance(null); setRouteDuration(null); setEncodedPolyline('');
        // ── CHANGE: reset name tracking when editing start ──
        routeNameUserEdited.current = false;
        setStep(1);
      } else {
        setEndPoint(null);
        markersRef.current.filter(m => m._type === 'end').forEach(m => m.setMap(null));
        markersRef.current = markersRef.current.filter(m => m._type !== 'end');
        if (directionsRenderer.current) directionsRenderer.current.setDirections({ routes: [] });
        setRouteDistance(null); setRouteDuration(null); setEncodedPolyline('');
        // ── CHANGE: reset name tracking when editing end ──
        routeNameUserEdited.current = false;
        setStep(2);
      }
      circlesRef.current.forEach(c => c.setMap(null));
      circlesRef.current = [];
    };

    /* Fetch directions when step 3 is entered */
    useEffect(() => {
      if (step !== 3 || !startPoint || !endPoint || !directionsService.current) return;

      // ── CHANGE: Auto-fill route name from start → end labels (if not user-edited) ──
      if (!routeNameUserEdited.current && routeNameRef.current) {
        const autoName = `${startPoint.label} → ${endPoint.label}`;
        routeNameRef.current.value = autoName;
      }

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
            directionsRenderer.current.setDirections(result);
            const leg = result.routes[0]?.legs[0];
            setRouteDistance(leg?.distance?.text);
            setRouteDuration(leg?.duration?.text);
            setEncodedPolyline(result.routes[0]?.overview_polyline || '');
            mapInstance.current.fitBounds(result.routes[0].bounds, 70);
          } else {
            toast.error('Could not calculate road route');
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
    }, [step]);

    /* Update threshold circles in step 3 */
    useEffect(() => {
      if (!mapInstance.current || step !== 3) return;
      circlesRef.current.forEach(c => c.setMap(null));
      circlesRef.current = [];
      if (startPoint) {
        const c = new window.google.maps.Circle({ center: startPoint, radius: threshold1, strokeColor: accent, strokeOpacity: 0.7, strokeWeight: 2, fillColor: accent, fillOpacity: 0.08, map: mapInstance.current });
        circlesRef.current.push(c);
      }
      if (endPoint) {
        const c = new window.google.maps.Circle({ center: endPoint, radius: threshold2, strokeColor: endColor, strokeOpacity: 0.7, strokeWeight: 2, fillColor: endColor, fillOpacity: 0.08, map: mapInstance.current });
        circlesRef.current.push(c);
      }
    }, [threshold1, threshold2, step]);

    const handleReset = () => {
      markersRef.current.forEach(m => m.setMap(null)); markersRef.current = [];
      circlesRef.current.forEach(c => c.setMap(null)); circlesRef.current = [];
      if (directionsRenderer.current) directionsRenderer.current.setDirections({ routes: [] });
      setStartPoint(null); setEndPoint(null);
      setRouteDistance(null); setRouteDuration(null); setEncodedPolyline('');
      // ── CHANGE: reset name tracking on full reset ──
      routeNameUserEdited.current = false;
      if (routeNameRef.current) routeNameRef.current.value = '';
      setStep(1);
    };

    const handleFinalSave = () => {
      const name = routeNameRef.current?.value?.trim();
      if (!name) { toast.error('Enter a route name'); return; }
      if (!encodedPolyline) { toast.error('Route not ready yet'); return; }
      onSave({
        routeName: name,
        encoding: encodedPolyline,
        node1: { latitude: startPoint.lat, longitude: startPoint.lng, label: startPoint.label },
        node2: { latitude: endPoint.lat, longitude: endPoint.lng, label: endPoint.label },
        threshold1: threshold1 / 1000,
        threshold2: threshold2 / 1000,
        threshold3: threshold3 / 1000,
      });
    };

    /* ── Step pills in header ── */
    const StepPills = () => (
      <div style={{ display: 'flex', gap: 5 }}>
        {[
          { n: 1, label: 'Start', color: accent },
          { n: 2, label: 'End', color: endColor },
          { n: 3, label: 'Save', color: '#6c9fff' },
        ].map(({ n, label, color }) => {
          const done = step > n;
          const active = step === n;
          return (
            <div key={n} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 20,
              background: active ? `${color}18` : done ? `${color}12` : 'transparent',
              border: `1.5px solid ${done || active ? color : '#2a2e2a'}`,
              opacity: done || active ? 1 : 0.38,
              transition: 'all 0.25s',
            }}>
              {done ? (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L4.5 8.5L10 3" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? color : '#333', display: 'inline-block', boxShadow: active ? `0 0 8px ${color}` : 'none' }} />
              )}
              <span style={{ fontSize: 10, fontWeight: 700, color: done || active ? color : '#333', letterSpacing: '0.04em' }}>{label}</span>
            </div>
          );
        })}
      </div>
    );

    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', flexDirection: 'column',
        background: '#05080f',
        fontFamily: "'DM Sans', -apple-system, sans-serif",
      }}>

        {/* ── Header ── */}
        <div style={{
          flexShrink: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: '#141714',
          borderBottom: `1px solid #252a25`,
          zIndex: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `${accent}18`, border: `1px solid ${accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Route size={14} style={{ color: accent }} />
            </div>
            <StepPills />
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #2e3330', color: '#888', cursor: 'pointer', padding: 7, borderRadius: 8, display: 'flex' }}>
            <X size={14} />
          </button>
        </div>

        {/* ── Map ── */}
        <div style={{
          flex: isPickingStep ? 1 : '0 0 36vh',
          position: 'relative',
          minHeight: 0,
          transition: 'flex 0.3s ease',
        }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

          {/* No API key / loading overlay */}
          {!mapsReady && (
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: '#0d1117', zIndex: 3 }}>
              {!MAPS_API_KEY ? (
                <div style={{ textAlign: 'center', color: '#556', padding: 20 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🗺</div>
                  <div style={{ fontWeight: 600 }}>Google Maps API key not set</div>
                  <div style={{ fontSize: 11 }}>Add VITE_GOOGLE_MAPS_API_KEY to .env</div>
                </div>
              ) : <div className="loader" />}
            </div>
          )}

          {/* ── Center Pin (only while picking a point) ── */}
          {isPickingStep && mapsReady && (
            <>
              {/* Pin SVG — lifts when dragging */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: `translate(-50%, ${isDragging ? '-120%' : '-100%'})`,
                pointerEvents: 'none', zIndex: 10,
                transition: 'transform 0.18s cubic-bezier(0.4,0,0.2,1)',
                filter: `drop-shadow(0 ${isDragging ? 10 : 4}px ${isDragging ? 20 : 8}px rgba(0,0,0,0.7))`,
              }}>
                <svg width="48" height="62" viewBox="0 0 48 62" fill="none">
                  <path d="M24 0C10.7 0 0 10.7 0 24C0 41 24 62 24 62C24 62 48 41 48 24C48 10.7 37.3 0 24 0Z" fill={pinColor} />
                  <circle cx="24" cy="24" r="11" fill="#05080f" />
                  <circle cx="24" cy="24" r="6" fill={pinColor} />
                </svg>
              </div>
              {/* Shadow dot */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, 2px)',
                width: isDragging ? 22 : 10, height: isDragging ? 7 : 4,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.45)',
                pointerEvents: 'none', zIndex: 9,
                transition: 'all 0.18s',
              }} />
            </>
          )}

          {/* ── Search box overlay (while picking) ── */}
          {isPickingStep && mapsReady && (
            <div style={{
              position: 'absolute', top: 10, left: 10, right: 56,
              zIndex: 15,
              background: '#141714',
              borderRadius: 11,
              border: `1.5px solid ${pinColor}44`,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
            }}>
              <PlaceSearchBox
                placeholder={step === 1 ? 'Search start location…' : 'Search end location…'}
                accentColor={pinColor}
                onSelect={handleSearchSelect}
              />
            </div>
          )}

          {/* ── Locate me button ── */}
          {mapsReady && (
            <button onClick={handleLocateMe} disabled={locating} style={{
              position: 'absolute',
              top: isPickingStep ? 10 : 8,
              right: 10, zIndex: 15,
              width: 40, height: 40, borderRadius: 10,
              background: '#141714ee',
              border: '1px solid #2e3330',
              color: locating ? '#556' : '#6c9fff',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
            }}>
              <Crosshair size={15} style={{ animation: locating ? 'ksp 1s linear infinite' : 'none' }} />
            </button>
          )}

          {/* ── Route info overlay (step 3) ── */}
          {!isPickingStep && startPoint && endPoint && (
            <div style={{
              position: 'absolute', top: 8, left: 8, zIndex: 5,
              background: 'rgba(13,18,32,0.93)', border: '1px solid #2e3330',
              borderRadius: 10, padding: '8px 11px', fontSize: 10,
              boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                <span style={{ color: '#d0d5cf' }}>{startPoint.label}</span>
              </div>
              <div style={{ width: 1, height: 8, background: '#2e3330', margin: '0 0 4px 3px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: endColor, flexShrink: 0 }} />
                <span style={{ color: '#d0d5cf' }}>{endPoint.label}</span>
              </div>
              {routeDistance && (
                <div style={{ marginTop: 5, paddingTop: 5, borderTop: '1px solid #2e3330', color: '#556', fontFamily: 'monospace', fontSize: 9 }}>
                  🛣 {routeDistance} · {routeDuration}
                </div>
              )}
            </div>
          )}

          {/* ── Start over button (step 3) ── */}
          {!isPickingStep && (
            <button onClick={handleReset} style={{
              position: 'absolute', bottom: 10, right: 10, zIndex: 5,
              background: 'rgba(13,18,32,0.9)', border: '1px solid #ff4d6d55',
              borderRadius: 8, padding: '5px 11px', color: '#ff6b6b',
              cursor: 'pointer', fontSize: 10, fontWeight: 600,
            }}>↩ Start over</button>
          )}
        </div>

        {/* ══════════════════════════════════════════════
            BOTTOM PANEL — Step 1 & 2: Confirm point
        ══════════════════════════════════════════════ */}
        {isPickingStep && (
          <div style={{
            flexShrink: 0,
            background: '#141714',
            borderTop: `3px solid ${pinColor}`,
            padding: '14px 14px 28px',
            boxShadow: '0 -10px 30px rgba(0,0,0,0.8)',
          }}>

            {/* Instruction row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: pinColor, boxShadow: `0 0 10px ${pinColor}`, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: pinColor, letterSpacing: '0.07em' }}>
                {step === 1 ? 'PAN THE MAP TO YOUR START POINT' : 'PAN THE MAP TO YOUR END POINT'}
              </span>
            </div>

            {/* Live address card */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#0d1220',
              border: `1.5px solid ${pinColor}33`,
              borderRadius: 13, padding: '13px 14px',
              marginBottom: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: `${pinColor}15`, border: `1.5px solid ${pinColor}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MapPin size={18} style={{ color: pinColor }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, color: '#556', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 3 }}>{pinLabel}</div>
                <div style={{
                  fontSize: 16, fontWeight: 700,
                  color: isGeocoding ? '#445' : '#e8ece7',
                  lineHeight: 1.25,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                }}>
                  {isGeocoding ? 'Getting address…' : centerAddress}
                </div>
                <div style={{ fontSize: 10, color: '#334', fontFamily: 'monospace', marginTop: 3 }}>
                  {centerCoords.lat.toFixed(5)}, {centerCoords.lng.toFixed(5)}
                </div>
              </div>
            </div>

            {/* Previously set start point (shown in step 2 as confirmation) */}
            {step === 2 && startPoint && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '8px 11px',
                background: `${accent}0c`,
                border: `1px solid ${accent}25`,
                borderRadius: 9, marginBottom: 12,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 9, color: accent, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 1 }}>START POINT SET ✓</div>
                  <div style={{ fontSize: 12, color: '#c8cec9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{startPoint.label}</div>
                </div>
                <button
                  onClick={() => handleEditPoint('start')}
                  style={{ background: 'none', border: `1px solid ${accent}44`, borderRadius: 6, padding: '2px 9px', color: accent, fontSize: 10, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                >
                  Edit
                </button>
              </div>
            )}

            {/* Confirm button */}
            <button
              onClick={handleConfirmPoint}
              disabled={isGeocoding}
              style={{
                width: '100%', padding: '15px 0',
                borderRadius: 14, border: 'none',
                background: isGeocoding
                  ? '#2a2e2a'
                  : step === 1
                    ? `linear-gradient(135deg, ${accent}, #00c97a)`
                    : `linear-gradient(135deg, ${endColor}, #ff4444)`,
                color: isGeocoding ? '#556' : step === 1 ? '#051a0f' : '#fff',
                fontSize: 15, fontWeight: 700,
                cursor: isGeocoding ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                boxShadow: isGeocoding ? 'none' : `0 6px 22px ${pinColor}55`,
                transition: 'all 0.2s',
              }}
            >
              <MapPin size={17} />
              {step === 1 ? 'Confirm Start Point' : 'Confirm End Point'}
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            BOTTOM PANEL — Step 3: Details & Save
        ══════════════════════════════════════════════ */}
        {step === 3 && (
          <div style={{
            flex: 1, background: '#141714',
            borderTop: `2px solid #252a25`,
            borderRadius: '16px 16px 0 0',
            overflowY: 'auto', overscrollBehavior: 'contain',
            padding: '14px 14px 32px',
            boxShadow: '0 -10px 32px rgba(0,0,0,0.8)',
          }}>
            <div style={{ width: 32, height: 3, borderRadius: 2, background: '#2e3330', margin: '0 auto 14px' }} />

            {/* Route summary card */}
            <div style={{
              background: '#1a1e1a', border: '1px solid #252a25',
              borderRadius: 12, padding: '12px 13px', marginBottom: 14,
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#445', letterSpacing: '0.1em', marginBottom: 10 }}>ROUTE SUMMARY</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Start */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                    <span style={{ fontSize: 8, fontWeight: 700, color: accent, letterSpacing: '0.06em' }}>START</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#d0d5cf', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{startPoint?.label}</div>
                  <button onClick={() => handleEditPoint('start')} style={{ marginTop: 4, background: 'none', border: `1px solid ${accent}44`, borderRadius: 5, padding: '2px 7px', fontSize: 9, color: accent, cursor: 'pointer' }}>Edit</button>
                </div>
                {/* Arrow */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <div style={{ width: 28, height: 2, background: '#2e3330' }} />
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M1 5H9M6 2L9 5L6 8" stroke="#445" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                {/* End */}
                <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3, justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 8, fontWeight: 700, color: endColor, letterSpacing: '0.06em' }}>END</span>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: endColor, flexShrink: 0 }} />
                  </div>
                  <div style={{ fontSize: 12, color: '#d0d5cf', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{endPoint?.label}</div>
                  <button onClick={() => handleEditPoint('end')} style={{ marginTop: 4, background: 'none', border: `1px solid ${endColor}44`, borderRadius: 5, padding: '2px 7px', fontSize: 9, color: endColor, cursor: 'pointer' }}>Edit</button>
                </div>
              </div>
              {routeDistance && (
                <div style={{ marginTop: 9, paddingTop: 9, borderTop: '1px solid #252a25', fontSize: 10, color: '#556', fontFamily: 'monospace' }}>
                  🛣 {routeDistance} · ⏱ {routeDuration}
                </div>
              )}
              {fetchingRoute && (
                <div style={{ marginTop: 9, paddingTop: 9, borderTop: '1px solid #252a25', fontSize: 10, color: accent, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="loader" style={{ width: 10, height: 10 }} />
                  Calculating best road route…
                </div>
              )}
            </div>

            {/* ── CHANGE: Route name input with auto-filled value + user-edit tracking ── */}
            <div style={{ marginBottom: 13 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#445', letterSpacing: '0.08em', marginBottom: 7 }}>
                ROUTE NAME
                <span style={{ marginLeft: 6, fontSize: 8, color: '#334', fontWeight: 500, letterSpacing: '0.04em' }}>
                  (auto-filled · you can edit)
                </span>
              </div>
              <input
                ref={routeNameRef}
                placeholder="e.g. Morning Shift Route"
                onChange={() => { routeNameUserEdited.current = true; }}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  border: '1.5px solid #2e3330', background: '#1e2120',
                  color: '#e0e0d8', fontSize: 14, fontFamily: 'inherit',
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = accent}
                onBlur={e => e.target.style.borderColor = '#2e3330'}
              />
            </div>

            {/* Threshold sliders */}
            <div style={{ marginBottom: 10, padding: '12px 13px', borderRadius: 11, border: '1px solid #2a2e2a', background: '#1a1e1a' }}>
              <TouchSlider value={threshold1} onChange={setThreshold1} min={100} max={5000} step={50} accentColor={accent} label="START ZONE THRESHOLD · T1" />
            </div>
            <div style={{ marginBottom: 10, padding: '12px 13px', borderRadius: 11, border: '1px solid #2a2e2a', background: '#1a1e1a' }}>
              <TouchSlider value={threshold2} onChange={setThreshold2} min={100} max={5000} step={50} accentColor={endColor} label="END ZONE THRESHOLD · T2" />
            </div>
            {/* ── CHANGE: T3 slider label updated to reflect route width behaviour ── */}
            <div style={{ marginBottom: 16, padding: '12px 13px', borderRadius: 11, border: '1px solid #2a2b2e', background: '#1a1b1e' }}>
              <TouchSlider value={threshold3} onChange={setThreshold3} min={50} max={2000} step={25} accentColor="#6c9fff" label="WAYPOINT RADIUS · T3  (also sets route width on map)" />
              {/* Live width preview bar */}
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 9, color: '#445', fontFamily: 'monospace', flexShrink: 0 }}>width preview</span>
                <div style={{
                  flex: 1, borderRadius: 99,
                  background: 'linear-gradient(90deg, #6c9fff88, #6c9fff)',
                  height: Math.max(2, t3ToStrokeWeight(threshold3)),
                  transition: 'height 0.15s ease',
                }} />
                <span style={{ fontSize: 9, color: '#6c9fff', fontFamily: 'monospace', flexShrink: 0 }}>
                  {t3ToStrokeWeight(threshold3).toFixed(1)}px
                </span>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleFinalSave}
              disabled={loading || fetchingRoute || !encodedPolyline}
              style={{
                width: '100%', padding: '15px 0', borderRadius: 14, border: 'none',
                background: loading || fetchingRoute || !encodedPolyline ? '#2a2e2a' : 'linear-gradient(135deg, #6c9fff, #3a7bef)',
                color: loading || fetchingRoute || !encodedPolyline ? '#556' : '#fff',
                fontSize: 15, fontWeight: 700,
                cursor: loading || fetchingRoute || !encodedPolyline ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                boxShadow: loading || fetchingRoute || !encodedPolyline ? 'none' : '0 6px 22px #6c9fff44',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Saving…' : fetchingRoute ? '🔄 Calculating route…' : <><CheckCircle size={17} /> Save Route</>}
            </button>
          </div>
        )}

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
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: '#4d9fff', fillOpacity: 0.3, strokeColor: '#4d9fff', strokeWeight: 3, strokeOpacity: 1 },
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
        if (!geocoder.current) {
          const pt = { lat, lng, label: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, fullAddress: '' };
          if (previewMarkerRef.current) { previewMarkerRef.current.setMap(null); previewMarkerRef.current = null; }
          previewMarkerRef.current = new window.google.maps.Marker({
            position: { lat, lng }, map,
            icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: '#4d9fff', fillOpacity: 0.3, strokeColor: '#4d9fff', strokeWeight: 3 },
            zIndex: 999,
          });
          setPreview(pt); return;
        }
        geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
          const label = (status === 'OK' && results[0])
            ? (results[0].address_components.find(p => p.types.includes('sublocality') || p.types.includes('locality'))?.long_name || results[0].formatted_address.split(',')[0])
            : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          const fullAddress = (status === 'OK' && results[0]) ? results[0].formatted_address : '';
          if (previewMarkerRef.current) { previewMarkerRef.current.setMap(null); previewMarkerRef.current = null; }
          previewMarkerRef.current = new window.google.maps.Marker({
            position: { lat, lng }, map,
            icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: '#4d9fff', fillOpacity: 0.3, strokeColor: '#4d9fff', strokeWeight: 3 },
            zIndex: 999,
          });
          setPreview({ lat, lng, label, fullAddress });
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
      if (circleRef.current) {
        circleRef.current.setRadius(radius);
        setTimeout(() => { if (circleRef.current) mapInstance.current.fitBounds(circleRef.current.getBounds(), 40); }, 50);
      }
    }, [radius]);

    const placeCenter = (lat, lng, label) => {
      setCenter({ lat, lng, label });
      updateCircle(lat, lng, radius);
    };

    const updateCircle = (lat, lng, r) => {
      const map = mapInstance.current;
      if (!markerRef.current) {
        markerRef.current = new window.google.maps.Marker({
          position: { lat, lng }, map,
          icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#4d9fff', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 },
        });
        circleRef.current = new window.google.maps.Circle({
          center: { lat, lng }, radius: r,
          strokeColor: '#4d9fff', strokeOpacity: 0.8, strokeWeight: 2,
          fillColor: '#4d9fff', fillOpacity: 0.1, map,
        });
      } else {
        markerRef.current.setPosition({ lat, lng });
        circleRef.current.setCenter({ lat, lng });
        circleRef.current.setRadius(r);
      }
      setTimeout(() => { if (circleRef.current) map.fitBounds(circleRef.current.getBounds(), 40); }, 50);
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
        <div style={{ flexShrink: 0, background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', padding: '11px 14px 12px', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Add Delivery Area</div>
              <div style={{ fontSize: 10, color: 'var(--text-2)' }}>{center ? '✅ Area set! Adjust radius and save.' : '📍 Search or tap map to set center'}</div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border)', color: 'var(--text-1)', cursor: 'pointer', padding: 7, borderRadius: 8, display: 'flex' }}>
              <X size={15} />
            </button>
          </div>
          {mapsReady && <PlaceSearchBox placeholder="Search area location…" accentColor="#4d9fff" onSelect={handlePreviewPlace} />}
          {preview && (
            <div style={{ marginTop: 9, background: 'rgba(13,18,32,0.97)', border: '1.5px solid #4d9fff', borderRadius: 11, padding: '9px 11px', display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#4d9fff', opacity: 0.6, flexShrink: 0, marginTop: 3, display: 'inline-block' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#4d9fff', marginBottom: 2 }}>Set as Area Center?</div>
                  <div style={{ fontSize: 13, color: 'var(--text-0)', fontWeight: 600, marginBottom: 2 }}>{preview.label}</div>
                  {preview.fullAddress && preview.fullAddress !== preview.label && (
                    <div style={{ fontSize: 10, color: 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{preview.fullAddress}</div>
                  )}
                  <div style={{ fontSize: 9, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{preview.lat.toFixed(5)}, {preview.lng.toFixed(5)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 7 }}>
                <button onClick={handleCancelPreview} style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: '1px solid var(--border-bright)', background: 'transparent', color: 'var(--text-2)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>✕ Cancel</button>
                <button onClick={handleConfirmPreview} style={{ flex: 2, padding: '7px 0', borderRadius: 8, border: 'none', background: '#4d9fff', color: '#000', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>✓ Confirm Area Center</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
          {!MAPS_API_KEY ? (
            <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg-2)' }}>
              <div style={{ textAlign: 'center', color: 'var(--text-2)', padding: 20 }}>
                <MapPin size={28} style={{ marginBottom: 10, opacity: 0.4 }} />
                <div style={{ fontWeight: 600, marginBottom: 5 }}>Google Maps API key not set</div>
                <div style={{ fontSize: 11 }}>Add VITE_GOOGLE_MAPS_API_KEY to your .env file</div>
              </div>
            </div>
          ) : !mapsReady ? (
            <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg-2)' }}><div className="loader" /></div>
          ) : (
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          )}
          {mapsReady && (
            <button onClick={handleLocateMe} disabled={locating} style={{
              position: 'absolute', bottom: 14, right: 14, zIndex: 1,
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--bg-1)', border: '1px solid var(--border-bright)',
              color: locating ? 'var(--text-2)' : 'var(--blue)',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}>
              <Crosshair size={16} style={{ animation: locating ? 'ksp 1s linear infinite' : 'none' }} />
            </button>
          )}
          {mapsReady && center && (
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, background: 'rgba(13,18,32,0.92)', border: '1px solid var(--border-bright)', borderRadius: 8, padding: '7px 10px', fontSize: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4d9fff', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-1)' }}>{center.label}</span>
              </div>
              <div style={{ color: 'var(--text-2)', marginTop: 2 }}>{(radius / 1000).toFixed(1)} km radius</div>
            </div>
          )}
        </div>

        <div style={{
          flexShrink: 0, background: 'var(--bg-1)', borderTop: '3px solid var(--blue)',
          borderRadius: '18px 18px 0 0', boxShadow: '0 -8px 32px rgba(0,0,0,0.7)',
          transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
          maxHeight: sheetOpen ? '58vh' : '46px', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 10,
        }}>
          <div
            onTouchStart={(e) => { e.currentTarget._startY = e.touches[0].clientY; e.currentTarget._moved = false; }}
            onTouchMove={(e) => { e.currentTarget._moved = true; }}
            onTouchEnd={(e) => { const dy = e.changedTouches[0].clientY - e.currentTarget._startY; if (Math.abs(dy) > 25) setSheetOpen(dy < 0); else if (!e.currentTarget._moved) setSheetOpen(o => !o); }}
            onClick={() => setSheetOpen(o => !o)}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '9px 14px 7px', flexShrink: 0, cursor: 'pointer', userSelect: 'none', gap: 4, touchAction: 'pan-x' }}>
            <div style={{ width: 36, height: 3, borderRadius: 2, background: sheetOpen ? 'rgba(255,255,255,0.45)' : 'var(--blue)', transition: 'background 0.2s' }} />
            <span style={{ fontSize: 10, lineHeight: 1, color: sheetOpen ? 'var(--text-2)' : 'var(--blue)', transition: 'color 0.2s' }}>
              {sheetOpen ? '↓ tap to close' : '↑ tap to configure'}
            </span>
          </div>
          <div style={{ overflowY: 'auto', overscrollBehavior: 'contain', padding: '0 14px 24px', flex: 1 }}>
            {center && (
              <div style={{ padding: '9px 11px', background: 'var(--blue-dim)', border: '1px solid rgba(77,159,255,0.25)', borderRadius: 8, marginBottom: 11, fontSize: 11 }}>
                <div style={{ fontWeight: 600, color: 'var(--blue)', marginBottom: 2 }}>📍 Center</div>
                <div style={{ color: 'var(--text-1)' }}>{center.label}</div>
                <div style={{ color: 'var(--text-2)', fontSize: 10, fontFamily: 'var(--font-mono)' }}>{center.lat.toFixed(6)}, {center.lng.toFixed(6)}</div>
              </div>
            )}
            <div style={{ marginBottom: 11 }}>
              <label style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Area Name *</label>
              <input className="form-input" placeholder="e.g. Andheri West" value={areaName} onChange={e => setAreaName(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: 12, borderRadius: 11, border: '1px solid #2a2e2a', background: '#1a1e1a', padding: '11px 13px' }}>
              <TouchSlider value={radius} onChange={setRadius} min={500} max={20000} step={500} accentColor="#4d9fff" label="AREA RADIUS" />
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              <button className="btn btn-secondary flex-1" onClick={onClose} style={{ fontSize: 13 }}>Cancel</button>
              <button className="btn btn-primary flex-1" onClick={handleSave} disabled={loading || !center || !areaName.trim()} style={{ fontSize: 13 }}>
                {loading ? 'Saving…' : <><CheckCircle size={12} /> Save Area</>}
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
            // ── CHANGE: Use saved threshold3 to set stroke weight in ViewMapModal too ──
            const strokeW = route.threshold3 ? t3ToStrokeWeight(route.threshold3 * 1000) : 4;
            const poly = new window.google.maps.Polyline({ path: decodedPath, strokeColor: color, strokeOpacity: 0.85, strokeWeight: strokeW, map: mapInstance.current });
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
        <div style={{ padding: '12px 14px', background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Layers size={16} style={{ color: 'var(--accent)' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>My Coverage Map</div>
              <div style={{ fontSize: 10, color: 'var(--text-2)' }}>Tap a chip to highlight it</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-1)', cursor: 'pointer', padding: 4 }}><X size={16} /></button>
        </div>
        <div style={{ display: 'flex', gap: 5, padding: '8px 14px 0', background: 'var(--bg-1)', flexShrink: 0 }}>
          {[{ key: 'routes', label: `🛣 Routes (${routes.length})` }, { key: 'areas', label: `📍 Areas (${areas.length})` }].map(t => (
            <button key={t.key} onClick={() => { setActiveTab(t.key); setSelectedId('all'); }}
              style={{ padding: '5px 13px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: activeTab === t.key ? 'var(--accent)' : 'var(--bg-2)', color: activeTab === t.key ? '#000' : 'var(--text-2)' }}>
              {t.label}
            </button>
          ))}
        </div>
        {hasData && (
          <div style={{ display: 'flex', gap: 5, padding: '7px 14px', overflowX: 'auto', background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <button onClick={() => setSelectedId('all')} style={{ flexShrink: 0, padding: '3px 11px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 600, background: selectedId === 'all' ? 'var(--accent)' : 'var(--bg-2)', color: selectedId === 'all' ? '#000' : 'var(--text-2)' }}>All</button>
            {activeItems.map((item, idx) => {
              const id = item.id || item.routeId || item.areaId;
              const label = item.routeName || item.areaName || item.name || `#${idx + 1}`;
              const colors = activeTab === 'routes' ? ROUTE_COLOURS : AREA_COLOURS;
              const color = colors[idx % colors.length];
              const isSelected = selectedId === id;
              return (
                <button key={id} onClick={() => setSelectedId(isSelected ? 'all' : id)}
                  style={{ flexShrink: 0, padding: '3px 11px', borderRadius: 20, border: `1.5px solid ${color}`, cursor: 'pointer', fontSize: 10, fontWeight: 600, background: isSelected ? color : 'transparent', color: isSelected ? '#000' : color }}>
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
                <MapPin size={28} style={{ marginBottom: 10, opacity: 0.4 }} />
                <div style={{ fontWeight: 600, marginBottom: 5 }}>Google Maps API key not set</div>
                <div style={{ fontSize: 11 }}>Add VITE_GOOGLE_MAPS_API_KEY to your .env file</div>
              </div>
            </div>
          ) : !mapsReady ? (
            <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg-2)' }}><div className="loader" /></div>
          ) : !hasData ? (
            <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg-2)' }}>
              <div style={{ textAlign: 'center', color: 'var(--text-2)', padding: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 10, opacity: 0.5 }}>{activeTab === 'routes' ? '🛣' : '📍'}</div>
                <div style={{ fontWeight: 600, marginBottom: 3 }}>No {activeTab === 'routes' ? 'routes' : 'areas'} registered</div>
                <div style={{ fontSize: 11 }}>Add {activeTab === 'routes' ? 'a route' : 'an area'} first</div>
              </div>
            </div>
          ) : (
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          )}
          {mapsReady && hasData && legendItems.length > 0 && (
            <div style={{ position: 'absolute', bottom: 14, left: 10, background: 'rgba(13,18,32,0.92)', border: '1px solid var(--border-bright)', borderRadius: 9, padding: '7px 10px', maxWidth: 'calc(100vw - 20px)', overflowX: 'auto' }}>
              {legendItems.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: legendItems.length > 1 ? 5 : 0 }}>
                  <span style={{ width: activeTab === 'routes' ? 16 : 9, height: activeTab === 'routes' ? 3 : 9, borderRadius: activeTab === 'routes' ? 2 : '50%', background: item.color, display: 'inline-block', flexShrink: 0, marginTop: activeTab === 'routes' ? 7 : 3, border: activeTab === 'areas' ? `2px solid ${item.color}` : 'none' }} />
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-1)', fontWeight: 600 }}>{item.label}</div>
                    {item.sub && <div style={{ fontSize: 9, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{item.sub}</div>}
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
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Routes & Areas</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Set your delivery coverage on the map</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={fetchData} style={{ padding: 7 }}><RefreshCw size={14} /></button>
        </div>

        <div style={{ display: 'flex', gap: 5, marginBottom: 14, background: 'var(--bg-2)', padding: 4, borderRadius: 10 }}>
          {['routes', 'areas'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: tab === t ? 'var(--bg-1)' : 'transparent', color: tab === t ? 'var(--accent)' : 'var(--text-2)', transition: 'all 0.15s ease' }}>
              {t === 'routes' ? '🛣 Routes' : '📍 Areas'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-center"><div className="loader" /></div>
        ) : tab === 'routes' ? (
          <>
            <div style={{ display: 'flex', gap: 7, marginBottom: 14 }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={() => setModal('route')}><Plus size={13} /> Add Route</button>
              {routes.length > 0 && <button className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={() => setViewModal('routes')}><Eye size={13} /> View Map</button>}
            </div>
            {routes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Route size={18} /></div>
                <h3>No routes yet</h3>
                <p>Tap above to draw your route on the map</p>
              </div>
            ) : routes.map(route => {
              const n1 = route.node1 || {}; const n2 = route.node2 || {};
              return (
                <div key={route.id || route.routeId} className="card" style={{ marginBottom: 9 }}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)', marginBottom: 3 }}>{route.routeName || `${n1.label || '?'} → ${n2.label || '?'}`}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />{n1.label || 'Start'}<span>→</span>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ff4d6d', display: 'inline-block' }} />{n2.label || 'End'}
                      </div>
                      {route.threshold1 && (
                        <div style={{ fontSize: 10, color: 'var(--text-2)', marginTop: 3, fontFamily: 'var(--font-mono)', display: 'flex', gap: 7 }}>
                          <span style={{ color: '#00e5a0' }}>T1:{route.threshold1}m</span>
                          <span style={{ color: '#ff4d6d' }}>T2:{route.threshold2}m</span>
                          <span style={{ color: '#4d9fff' }}>T3:{route.threshold3}m</span>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: 7 }} onClick={() => setViewModal('routes')}><Eye size={12} /></button>
                      <button className="btn btn-danger btn-sm" style={{ padding: 7 }} onClick={() => deleteRoute(route.id || route.routeId)}><Trash2 size={12} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 7, marginBottom: 14 }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={() => setModal('area')}><Plus size={13} /> Add Area</button>
              {areas.length > 0 && <button className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={() => setViewModal('areas')}><Eye size={13} /> View Map</button>}
            </div>
            {areas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Circle size={18} /></div>
                <h3>No areas yet</h3>
                <p>Tap above to mark your delivery area</p>
              </div>
            ) : areas.map(area => {
              const node = area.node || {};
              return (
                <div key={area.id || area.areaId} className="card" style={{ marginBottom: 9 }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)' }}>{area.areaName || area.name}</div>
                      {node.label && <div style={{ fontSize: 11, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} /> {node.label}</div>}
                      {area.threshold && <div style={{ fontSize: 10, color: 'var(--blue)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>Radius: {(area.threshold / 1000).toFixed(1)} km</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: 7 }} onClick={() => setViewModal('areas')}><Eye size={12} /></button>
                      <button className="btn btn-danger btn-sm" style={{ padding: 7 }} onClick={() => deleteArea(area.id || area.areaId)}><Trash2 size={12} /></button>
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