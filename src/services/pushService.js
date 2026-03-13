/**
 * pushService.js — FCM push notifications.
 *
 * Strategy:
 *  - On Android (Capacitor native): uses @capacitor/push-notifications
 *    → native FCM layer → works even when app is fully killed
 *  - In browser (dev / PWA): uses firebase/messaging + service worker
 *    → works for foreground and background (tab hidden), not app-killed
 *
 * Both paths save the FCM token to the backend in the same way.
 * The backend doesn't care which path generated the token.
 */

import { ridersAPI } from './api';
import { logger }    from '../utils/logger';

const log = logger('Push');

let initialized = false;

/** True when running inside a Capacitor Android/iOS app */
function isNative() {
  return typeof window !== 'undefined' && !!window.Capacitor?.isNativePlatform?.();
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Call once after login.
 * Automatically picks the right push path (native vs web).
 *
 * @param {string}   riderUid   - Logged-in rider's UID
 * @param {function} onNavigate - Called with orderId when rider taps a push notification
 */
export async function initPushNotifications(riderUid, onNavigate) {
  if (initialized) return;

  if (isNative()) {
    await initNativePush(riderUid, onNavigate);
  } else {
    await initWebPush(riderUid);
  }
}

/**
 * Call on logout — clears token from backend.
 */
export async function clearPushToken(riderUid) {
  try {
    await ridersAPI.clearFcmToken(riderUid);
    initialized = false;
    log.info('FCM token cleared');
  } catch (err) {
    log.warn('Failed to clear FCM token', { error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// NATIVE PATH — @capacitor/push-notifications (Android)
// Works when app is fully closed — Android FCM wakes the native layer.
// ─────────────────────────────────────────────────────────────────────────────

async function initNativePush(riderUid, onNavigate) {
  try {
    // Dynamic import — only loads on device, never bundled for browser
    const { PushNotifications }  = await import('@capacitor/push-notifications');
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const { Capacitor }          = await import('@capacitor/core');

    // Create notification channel (Android 8+)
    if (Capacitor.getPlatform() === 'android') {
      await LocalNotifications.createChannel({
        id:          'order_alerts',
        name:        'Order Alerts',
        description: 'New delivery order notifications',
        importance:  5,       // IMPORTANCE_HIGH — heads-up popup
        vibration:   true,
        sound:       'default',
        visibility:  1,       // show on lock screen
      });
    }

    // Request permission
    const perm = await PushNotifications.requestPermissions();
    if (perm.receive !== 'granted') {
      log.warn('[Native] Push permission denied');
      return;
    }

    // Register with FCM
    await PushNotifications.register();

    // Save token to backend
    PushNotifications.addListener('registration', async ({ value: token }) => {
      log.info('[Native] FCM token received');
      try {
        await ridersAPI.saveFcmToken(riderUid, token);
        log.info('[Native] Token saved to backend');
      } catch (err) {
        log.warn('[Native] Failed to save token', { error: err.message });
      }
    });

    // App open — socket already handles ORDER_AVAILABLE, nothing extra needed
    PushNotifications.addListener('pushNotificationReceived', () => {});

    // App closed/background — rider taps notification → open order page
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      const data = action.notification.data;
      if (data?.type === 'ORDER_AVAILABLE' && data?.orderId) {
        setTimeout(() => onNavigate?.(data.orderId), 500);
      }
    });

    PushNotifications.addListener('registrationError', (err) => {
      log.warn('[Native] Registration error', { error: err.error });
    });

    initialized = true;
    log.info('[Native] Push notifications initialized');
  } catch (err) {
    log.warn('[Native] initNativePush failed', { error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// WEB PATH — firebase/messaging (browser / PWA)
// Works for foreground + background tab. App-fully-killed not guaranteed on Android.
// ─────────────────────────────────────────────────────────────────────────────

async function initWebPush(riderUid) {
  try {
    const { getMessaging, getToken, onMessage } = await import('firebase/messaging');
    const { default: firebaseApp }              = await import('./firebase');

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      log.warn('[Web] Push permission denied');
      return;
    }

    const msg   = getMessaging(firebaseApp);
    const token = await getToken(msg, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (!token) {
      log.warn('[Web] No FCM token — add VITE_FIREBASE_VAPID_KEY to .env');
      return;
    }

    await ridersAPI.saveFcmToken(riderUid, token);
    log.info('[Web] FCM token saved to backend');

    // Foreground — socket handles ORDER_AVAILABLE, just log
    onMessage(msg, (payload) => {
      log.debug('[Web] Foreground push (socket handles this)', { type: payload.data?.type });
    });

    initialized = true;
    log.info('[Web] Push notifications initialized');
  } catch (err) {
    log.warn('[Web] initWebPush failed', { error: err.message });
  }
}