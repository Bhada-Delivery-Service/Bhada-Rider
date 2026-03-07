/**
 * useOrders — Encapsulates all order-related state, fetching,
 * and real-time WebSocket event handling.
 *
 * Keeps OrdersPage, DashboardPage, etc. thin by moving the data
 * logic into a reusable hook.
 *
 * Returns:
 *   availableOrders  — PLACED orders eligible for this rider
 *   myOrders         — orders assigned to this rider
 *   loading          — true during first fetch
 *   refreshing       — true during background refresh (no skeleton)
 *   error            — last fetch error message or null
 *   refetch()        — manually reload both lists
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { ordersAPI } from '../services/api';
import { getSocket } from '../services/socketService';
import { logger } from '../utils/logger';
import toast from 'react-hot-toast';

const log = logger('useOrders');

export function useOrders({ autoFetch = true } = {}) {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders,        setMyOrders]        = useState([]);
  const [loading,         setLoading]         = useState(autoFetch);
  const [refreshing,      setRefreshing]      = useState(false);
  const [error,           setError]           = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Core fetch ────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async ({ silent = false } = {}) => {
    if (!mountedRef.current) return;
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [availRes, myRes] = await Promise.allSettled([
        ordersAPI.getAvailable(),
        ordersAPI.getMyOrders(),
      ]);

      if (!mountedRef.current) return;

      if (availRes.status === 'fulfilled') {
        setAvailableOrders(availRes.value.data?.data ?? []);
        log.debug('Available orders loaded', { count: availRes.value.data?.data?.length });
      } else {
        log.warn('Failed to load available orders', availRes.reason?.message);
      }

      if (myRes.status === 'fulfilled') {
        setMyOrders(myRes.value.data?.data ?? []);
        log.debug('My orders loaded', { count: myRes.value.data?.data?.length });
      } else {
        log.warn('Failed to load my orders', myRes.reason?.message);
      }

    } catch (err) {
      log.error('fetchOrders unexpected error', err);
      if (!silent) setError('Failed to load orders');
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (autoFetch) fetchOrders();
  }, [autoFetch, fetchOrders]);

  // ── Real-time WebSocket updates ───────────────────────────────────────────
  useEffect(() => {
    const handleOrderUpdate = (e) => {
      const updated = e.detail;
      if (!updated?.orderId) return;

      log.debug('ws:order:updated received', { orderId: updated.orderId, status: updated.status });

      // New PLACED order → re-fetch (eligibility is server-side)
      if (updated.status === 'PLACED') {
        fetchOrders({ silent: true });
        return;
      }

      // Cancelled → remove from both lists
      if (updated.status === 'CANCELLED') {
        setAvailableOrders(prev => prev.filter(o => (o.orderId || o.id) !== updated.orderId));
        setMyOrders(prev => prev.filter(o => (o.orderId || o.id) !== updated.orderId));
        return;
      }

      // READY / DISPATCHED / DELIVERED → update or add to myOrders
      setMyOrders(prev => {
        const exists = prev.some(o => (o.orderId || o.id) === updated.orderId);
        if (exists) {
          return prev.map(o =>
            (o.orderId || o.id) === updated.orderId ? { ...o, ...updated } : o
          );
        }
        if (updated.assignedRiderId) return [updated, ...prev];
        return prev;
      });

      // Remove from available once no longer PLACED
      setAvailableOrders(prev => prev.filter(o => (o.orderId || o.id) !== updated.orderId));
    };

    // Socket notification for new available order
    const handleSocketNotif = (n) => {
      if (n?.type === 'ORDER_AVAILABLE') {
        fetchOrders({ silent: true });
        toast('📦 New order available!', { duration: 3000 });
      }
    };

    window.addEventListener('ws:order:updated', handleOrderUpdate);

    const socket = getSocket();
    socket?.on('notification:new', handleSocketNotif);

    return () => {
      window.removeEventListener('ws:order:updated', handleOrderUpdate);
      socket?.off('notification:new', handleSocketNotif);
    };
  }, [fetchOrders]);

  return {
    availableOrders,
    myOrders,
    loading,
    refreshing,
    error,
    refetch: () => fetchOrders({ silent: false }),
    refetchSilent: () => fetchOrders({ silent: true }),
    // Derived helpers
    placedOrders:     availableOrders.filter(o => o.status === 'PLACED'),
    activeOrders:     myOrders.filter(o => ['READY','DISPATCHED'].includes(o.status)),
  };
}
