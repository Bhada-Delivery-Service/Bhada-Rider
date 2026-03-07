/**
 * socketService.js — Enhanced with:
 *
 *  1. Exponential backoff reconnect strategy
 *  2. Heartbeat / ping mechanism
 *  3. Socket change listeners for locationService
 *  4. Clean listener management to prevent duplicate bindings
 */

import { io } from 'socket.io-client';
import { logger } from '../utils/logger';

const log = logger('Socket');
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const RECONNECT_DELAYS    = [1000, 2000, 4000, 8000, 16000, 30000];
const HEARTBEAT_INTERVAL  = 25000;
const HEARTBEAT_TIMEOUT   = 5000;

let socket         = null;
let heartbeatTimer = null;
let heartbeatCheck = null;
let reconnectCount = 0;
let reconnectTimer = null;

const socketChangeListeners = new Set();

export function onSocketChanged(fn) {
  socketChangeListeners.add(fn);
  return () => socketChangeListeners.delete(fn);
}

function notifySocketChanged(newSocket) {
  socketChangeListeners.forEach(fn => fn(newSocket));
}

function startHeartbeat() {
  stopHeartbeat();
  heartbeatTimer = setInterval(() => {
    if (!socket?.connected) return;
    socket.emit('ping');
    heartbeatCheck = setTimeout(() => {
      log.warn('Heartbeat timeout — connection may be stale');
    }, HEARTBEAT_TIMEOUT);
    socket.once('pong', () => {
      clearTimeout(heartbeatCheck);
      heartbeatCheck = null;
    });
  }, HEARTBEAT_INTERVAL);
}

function stopHeartbeat() {
  clearInterval(heartbeatTimer);
  clearTimeout(heartbeatCheck);
  heartbeatTimer = null;
  heartbeatCheck = null;
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  const delay = RECONNECT_DELAYS[Math.min(reconnectCount, RECONNECT_DELAYS.length - 1)];
  reconnectCount++;
  log.info(`Reconnect scheduled in ${delay}ms (attempt ${reconnectCount})`);
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    if (socket && !socket.connected) {
      log.info('Attempting reconnect…');
      socket.connect();
    }
  }, delay);
}

export function connectSocket(token) {
  if (socket?.connected) return socket;

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    stopHeartbeat();
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  }

  reconnectCount = 0;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: false,  // we handle reconnect manually with backoff
  });

  socket.on('connect', () => {
    reconnectCount = 0;
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
    log.info('Connected', { id: socket.id });
    startHeartbeat();
  });

  socket.on('disconnect', (reason) => {
    log.warn('Disconnected', { reason });
    stopHeartbeat();
    if (reason !== 'io client disconnect') {
      scheduleReconnect();
    }
  });

  socket.on('connect_error', (err) => {
    log.warn('Connection error', { message: err.message });
    scheduleReconnect();
  });

  notifySocketChanged(socket);
  return socket;
}

export function disconnectSocket() {
  stopHeartbeat();
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    reconnectCount = 0;
  }
  notifySocketChanged(null);
  log.info('Disconnected (explicit)');
}

export function getSocket() { return socket; }
export function isSocketConnected() { return socket?.connected === true; }
