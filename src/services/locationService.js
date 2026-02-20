/**
 * locationService.js
 *
 * Continuously tracks the rider's GPS position and broadcasts it to the
 * backend via Socket.IO so admins can see real-time rider locations.
 *
 * Usage:
 *   import { startTracking, stopTracking } from './locationService';
 *   startTracking(socket);   // call when rider goes online
 *   stopTracking();          // call when rider goes offline / logs out
 */

const EMIT_INTERVAL_MS = 5000; // send location every 5 seconds
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  maximumAge: 3000,
  timeout: 10000,
};

let watchId = null;       // navigator.geolocation watchId
let intervalId = null;    // setInterval id for throttled emitting
let lastPosition = null;  // most recent GeolocationPosition
let socketRef = null;     // socket.io socket instance

/**
 * Start tracking & broadcasting the rider's location.
 * @param {Socket} socket - connected socket.io client
 */
export function startTracking(socket) {
  if (!socket) {
    console.warn('[Location] No socket provided');
    return;
  }
  socketRef = socket;

  if (!navigator.geolocation) {
    console.warn('[Location] Geolocation not supported');
    return;
  }

  // Watch position for low-latency updates
  watchId = navigator.geolocation.watchPosition(
    (pos) => { lastPosition = pos; },
    (err) => console.warn('[Location] watchPosition error:', err.message),
    GEOLOCATION_OPTIONS
  );

  // Emit on a fixed interval to avoid flooding the socket
  intervalId = setInterval(() => {
    if (!lastPosition || !socketRef?.connected) return;
    const { latitude, longitude, accuracy, heading, speed } = lastPosition.coords;
    socketRef.emit('rider:location', {
      latitude,
      longitude,
      accuracy: accuracy || 0,
      heading: heading || null,
      speed: speed || null,
      timestamp: Date.now(),
    });
  }, EMIT_INTERVAL_MS);

  console.log('[Location] Tracking started');
}

/**
 * Stop tracking & broadcasting.
 */
export function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  lastPosition = null;
  socketRef = null;
  console.log('[Location] Tracking stopped');
}

/**
 * One-shot current position promise.
 * @returns {Promise<{lat: number, lng: number}>}
 */
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      reject,
      GEOLOCATION_OPTIONS
    );
  });
}
