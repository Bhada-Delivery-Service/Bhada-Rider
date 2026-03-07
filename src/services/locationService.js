/**
 * locationService.js — GPS tracking with:
 *
 *  - Distance-based throttle: only emit if rider moved > MIN_DISTANCE_M metres
 *    OR > EMIT_INTERVAL_MS has passed since last emit.
 *    Prevents spamming the server when the rider is stationary.
 *
 *  - Socket-change subscription: stays in sync when NotificationContext
 *    replaces the socket on token refresh.
 *
 *  - Exponential backoff on first-fix failure (rare, but handles cold phones).
 */

import { onSocketChanged } from './socketService';
import { logger } from '../utils/logger';

const log = logger('Location');

const EMIT_INTERVAL_MS  = 5000;   // max interval between emits
const MIN_DISTANCE_M    = 15;     // min distance to trigger early emit
const WARMUP_TIMEOUT_MS = 8000;

const GEO_FAST = { enableHighAccuracy: false, maximumAge: 30_000, timeout: 5_000 };
const GEO_ACC  = { enableHighAccuracy: true,  maximumAge:  3_000, timeout: 10_000 };

let watchId      = null;
let intervalId   = null;
let lastPosition = null;
let lastEmitPos  = null;  // position at the time of the last emit
let socketRef    = null;
let warmedUp     = false;
let onConnectHandler  = null;
let unsubSocketChange = null;

// ── Haversine distance (metres) between two {coords} positions ──────────────
function haversineM(pos1, pos2) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const lat1 = pos1.coords.latitude,  lon1 = pos1.coords.longitude;
  const lat2 = pos2.coords.latitude, lon2 = pos2.coords.longitude;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function buildPayload(pos) {
  const { latitude, longitude, accuracy, heading, speed } = pos.coords;
  return { latitude, longitude, accuracy: accuracy || 0, heading: heading || null, speed: speed || null, timestamp: Date.now() };
}

function shouldEmit() {
  if (!lastPosition) return false;
  if (!lastEmitPos) return true;  // first emit

  // Emit if moved enough
  const dist = haversineM(lastPosition, lastEmitPos);
  if (dist >= MIN_DISTANCE_M) {
    log.debug('Emit triggered by movement', { distMetres: Math.round(dist) });
    return true;
  }
  return false; // interval timer will handle time-based emit
}

function emitNow(forceSend = false) {
  if (!lastPosition || !socketRef?.connected) return;
  if (!forceSend && !shouldEmit()) return;
  socketRef.emit('rider:location', buildPayload(lastPosition));
  lastEmitPos = lastPosition;
  log.debug('Location emitted', { lat: lastPosition.coords.latitude.toFixed(5), lng: lastPosition.coords.longitude.toFixed(5) });
}

function emitOnConnect(onFirstFix) {
  if (onConnectHandler) { socketRef?.off('connect', onConnectHandler); onConnectHandler = null; }
  if (socketRef?.connected) { emitNow(true); onFirstFix?.(); return; }
  onConnectHandler = () => { emitNow(true); onFirstFix?.(); onConnectHandler = null; };
  socketRef?.once('connect', onConnectHandler);
}

function handleSocketChanged(newSocket) {
  if (onConnectHandler && socketRef) { socketRef.off('connect', onConnectHandler); onConnectHandler = null; }
  socketRef = newSocket;
  if (intervalId !== null && newSocket) {
    log.info('Socket replaced — will emit on next connect');
    emitOnConnect(null);
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

export function warmupGPS() {
  if (warmedUp || !navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => { lastPosition = pos; warmedUp = true; log.info('GPS warmed up'); },
    (err) => { log.warn('GPS warmup failed', err.message); warmedUp = true; },
    GEO_FAST,
  );
}

export function startTracking(socket, onFirstFix) {
  if (!socket || !navigator.geolocation) {
    log.warn('Cannot start tracking — missing socket or geolocation');
    return;
  }

  socketRef = socket;
  if (unsubSocketChange) unsubSocketChange();
  unsubSocketChange = onSocketChanged(handleSocketChanged);

  // First fix
  if (lastPosition) {
    emitOnConnect(onFirstFix);
  } else {
    navigator.geolocation.getCurrentPosition(
      (pos) => { lastPosition = pos; emitOnConnect(onFirstFix); },
      (err)  => log.warn('First-fix failed', err.message),
      { ...GEO_FAST, timeout: WARMUP_TIMEOUT_MS },
    );
  }

  // High-accuracy continuous watch
  if (watchId === null) {
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        lastPosition = pos;
        // Distance-triggered emit (interval handles time-based)
        if (shouldEmit()) emitNow(true);
      },
      (err) => log.warn('watchPosition error', err.message),
      GEO_ACC,
    );
  }

  // Time-based interval fallback
  if (intervalId === null) {
    intervalId = setInterval(() => emitNow(true), EMIT_INTERVAL_MS);
  }

  log.info('Tracking started');
}

export function stopTracking() {
  if (onConnectHandler && socketRef) { socketRef.off('connect', onConnectHandler); onConnectHandler = null; }
  if (unsubSocketChange) { unsubSocketChange(); unsubSocketChange = null; }
  if (watchId !== null)  { navigator.geolocation.clearWatch(watchId); watchId = null; }
  if (intervalId !== null) { clearInterval(intervalId); intervalId = null; }
  socketRef = null;
  lastEmitPos = null;
  log.info('Tracking stopped');
}

export function getCurrentPosition() {
  if (lastPosition) {
    const age = Date.now() - lastPosition.timestamp;
    if (age < 30_000) return Promise.resolve({ lat: lastPosition.coords.latitude, lng: lastPosition.coords.longitude });
  }
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error('Geolocation not supported')); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { lastPosition = pos; resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }); },
      reject,
      GEO_ACC,
    );
  });
}
