import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { notificationsAPI } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socketService';

const NotificationContext = createContext(null);

const NOTIF_EMOJI = {
  ONBOARDING_SUBMITTED:  '📋',
  ONBOARDING_APPROVED:   '🎉',
  ONBOARDING_REJECTED:   '❌',
  KYC_SUBMITTED:         '📄',
  KYC_APPROVED:          '✅',
  KYC_REJECTED:          '❌',
  ORDER_PLACED:          '📦',
  ORDER_ACCEPTED:        '🛵',
  ORDER_DISPATCHED:      '🚀',
  ORDER_DELIVERED:       '✅',
  ORDER_CANCELLED:       '🚫',
  ORDER_AVAILABLE:       '📦',
  DISPUTE_RAISED:        '⚠️',
  DISPUTE_RESOLVED:      '✅',
  PAYMENT_SUCCESS:       '💳',
  PAYMENT_REFUNDED:      '💸',
  EARNING_CREDITED:      '💰',
};

export function NotificationProvider({ children, accessToken, onOnboardingApproved }) {
  const [notifications, setNotifications]   = useState([]);
  const [unseenCount,   setUnseenCount]     = useState(0);
  const [loading,       setLoading]         = useState(false);
  const [drawerOpen,    setDrawerOpen]      = useState(false);
  const socketRef = useRef(null);

  // ── Fetch from REST ──────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const { data } = await notificationsAPI.getAll(30);
      setNotifications(data.data || []);
      setUnseenCount(data.unseen ?? 0);
    } catch (e) {
      console.error('[Notif:Rider] fetch failed', e);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // ── Socket setup ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!accessToken) return;

    // BUG FIX: Disconnect any stale socket before creating a new one.
    // Previously, if accessToken changed (e.g. after token refresh), the old
    // socket kept running and the new one would silently fail to connect.
    disconnectSocket();

    const socket = connectSocket(accessToken);
    socketRef.current = socket;

    socket.on('notification:new', (n) => {
      // Persist DB-backed notifications in local state
      if (n.id) {
        setNotifications(prev => [n, ...prev]);
        setUnseenCount(prev => prev + 1);
      }

      // Special case: onboarding approved → trigger re-fetch of rider status
      if (n.type === 'ONBOARDING_APPROVED') {
        onOnboardingApproved?.();
      }

      // Show toast for all events
      const emoji = NOTIF_EMOJI[n.type] || '🔔';
      toast(`${emoji}  ${n.title}\n${n.body}`, {
        duration: 6000,
        style: {
          background: '#131929',
          color: '#f0f4ff',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '13px',
          maxWidth: '340px',
          whiteSpace: 'pre-line',
          lineHeight: 1.5,
        },
      });
    });

    socket.on('notification:count', ({ unseen }) => {
      setUnseenCount(unseen);
    });

    // ── Real-time data sync → dispatch as window CustomEvents so individual
    // pages (OrdersPage, OrderDetailPage, DashboardPage) can subscribe without
    // prop drilling. The backend emits these events to the rider's socket room.
    socket.on('order:updated', (data) => {
      window.dispatchEvent(new CustomEvent('ws:order:updated', { detail: data }));
    });

    socket.on('rider:updated', (data) => {
      window.dispatchEvent(new CustomEvent('ws:rider:updated', { detail: data }));
    });

    fetchNotifications();

    return () => {
      // BUG FIX: clean up specific listeners (don't destroy socket here —
      // that's handled by the accessToken=null cleanup effect below)
      socket.off('notification:new');
      socket.off('notification:count');
      socket.off('order:updated');
      socket.off('rider:updated');
    };
  }, [accessToken, fetchNotifications, onOnboardingApproved]);

  // Cleanup on logout
  useEffect(() => {
    if (!accessToken) {
      disconnectSocket();
      setNotifications([]);
      setUnseenCount(0);
      setDrawerOpen(false);
    }
  }, [accessToken]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const markSeen = useCallback(async (id) => {
    try {
      await notificationsAPI.markSeen(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, seen: true } : n));
      setUnseenCount(prev => Math.max(0, prev - 1));
    } catch (e) { console.error('[Notif:Rider] markSeen failed', e); }
  }, []);

  const markAllSeen = useCallback(async () => {
    try {
      await notificationsAPI.markAllSeen();
      setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
      setUnseenCount(0);
    } catch (e) { console.error('[Notif:Rider] markAllSeen failed', e); }
  }, []);

  const openDrawer  = useCallback(() => setDrawerOpen(true),  []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <NotificationContext.Provider value={{
      notifications, unseenCount, loading, drawerOpen,
      fetchNotifications, markSeen, markAllSeen, openDrawer, closeDrawer,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider');
  return ctx;
};