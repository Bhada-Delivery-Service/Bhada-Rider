/**
 * logger.js — Structured, leveled frontend logger
 *
 * Usage:
 *   import { logger } from '../utils/logger';
 *   const log = logger('Dashboard');
 *   log.info('Rider fetched', { status: 'ONLINE' });
 *   log.warn('Socket not ready, retrying');
 *   log.error('API call failed', err);
 *   log.action('accept_order', { orderId: '...' });   ← audit trail
 */

const IS_DEV = import.meta.env.DEV;
const IS_PROD = import.meta.env.PROD;

// ------------- in-memory circular buffer for crash reporting ---------------
const BUFFER_SIZE = 100;
const logBuffer = [];

function pushBuffer(entry) {
  if (logBuffer.length >= BUFFER_SIZE) logBuffer.shift();
  logBuffer.push(entry);
}

/** Return recent log entries — useful to attach to error reports */
export function getLogBuffer() {
  return [...logBuffer];
}

// ------------- ANSI colours for console (dev only) -------------------------
const COLOURS = {
  info:   'color:#4d9fff;font-weight:600',
  warn:   'color:#ff9a3c;font-weight:600',
  error:  'color:#ff4d6d;font-weight:700',
  action: 'color:#00e5a0;font-weight:700',
  debug:  'color:#a855f7;font-weight:500',
};

// ------------- Core logger factory -----------------------------------------
export function logger(module = 'App') {
  function write(level, message, data) {
    const ts = new Date().toISOString();
    const entry = { ts, level, module, message, data: data ?? null };
    pushBuffer(entry);

    // In production: only warn/error/action to console
    if (IS_PROD && level === 'debug') return;

    const prefix = `[${module}]`;
    if (IS_DEV) {
      const style = COLOURS[level] || '';
      if (data !== undefined) {
        console.groupCollapsed(`%c${level.toUpperCase()} ${prefix} ${message}`, style);
        console.log('data:', data);
        console.log('time:', ts);
        console.groupEnd();
      } else {
        console.log(`%c${level.toUpperCase()} ${prefix} ${message}`, style);
      }
    } else {
      // Production: structured JSON to console (Sentry / DataDog can scrape this)
      const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[method](JSON.stringify(entry));
    }
  }

  return {
    debug:  (msg, data) => write('debug',  msg, data),
    info:   (msg, data) => write('info',   msg, data),
    warn:   (msg, data) => write('warn',   msg, data),
    error:  (msg, data) => write('error',  msg, data),
    /**
     * action() — logs critical rider events for audit trail.
     * These always go to the buffer and to console (prod + dev).
     */
    action: (event, data) => {
      const ts = new Date().toISOString();
      const entry = { ts, level: 'action', module, event, data: data ?? null };
      pushBuffer(entry);
      if (IS_DEV) {
        console.log(`%cACTION [${module}] ${event}`, COLOURS.action, data ?? '');
      } else {
        console.log(JSON.stringify(entry));
      }
    },
  };
}

// ------------- Global error capture ----------------------------------------
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (e) => {
    const log = logger('GlobalError');
    log.error('Unhandled promise rejection', {
      reason: e.reason?.message || String(e.reason),
      stack: e.reason?.stack,
    });
  });

  window.addEventListener('error', (e) => {
    const log = logger('GlobalError');
    log.error('Uncaught JS error', {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
    });
  });
}
