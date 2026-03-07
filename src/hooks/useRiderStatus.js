/**
 * useRiderStatus — Encapsulates rider availability state,
 * status transitions (online/offline/break), GPS tracking,
 * and real-time WebSocket rider updates.
 *
 * Extracted from DashboardPage to keep the page component thin.
 *
 * Returns:
 *   riderData       — current rider object
 *   performance     — performance stats
 *   loading         — initial load spinner
 *   loadingStatus   — in-flight status change
 *   tracking        — GPS is actively emitting
 *   currentStatus   — 'ONLINE'|'AVAILABLE'|'OFFLINE'|'ON_BREAK'|'BUSY'
 *   isOnline        — true for ONLINE/AVAILABLE/BUSY
 *   changeStatus(action) — 'online'|'offline'|'break'|'resume'
 *   refresh()       — reload rider + performance data
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ridersAPI } from '../services/api';
import { getSocket } from '../services/socketService';
import { startTracking, stopTracking, warmupGPS } from '../services/locationService';
import { useAuth } from '../context/AuthContext';
import { useActionGuard } from './useActionGuard';
import { logger } from '../utils/logger';

const log = logger('useRiderStatus');

export function useRiderStatus() {
  const { user, rider, updateRider } = useAuth();
  const [riderData,   setRiderData]   = useState(rider || null);
  const [performance, setPerformance] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [tracking,    setTracking]    = useState(false);

  const { guard, isLoading } = useActionGuard();
  const trackingRef   = useRef(false);
  const retryTimerRef = useRef(null);
  const mountedRef    = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Start/stop GPS tracking based on status ──────────────────────────────
  const handleTrackingForStatus = useCallback((status) => {
    const shouldTrack = ['ONLINE', 'AVAILABLE', 'BUSY'].includes(status);

    if (shouldTrack && !trackingRef.current) {
      const socket = getSocket();
      if (socket) {
        startTracking(socket, () => {
          if (mountedRef.current) setTracking(true);
        });
        trackingRef.current = true;
        if (retryTimerRef.current) {
          clearTimeout(retryTimerRef.current);
          retryTimerRef.current = null;
        }
        log.info('GPS tracking started', { status });
      } else {
        log.warn('Socket not ready — retrying tracking in 300ms');
        retryTimerRef.current = setTimeout(() => {
          retryTimerRef.current = null;
          handleTrackingForStatus(status);
        }, 300);
      }
    } else if (!shouldTrack && trackingRef.current) {
      stopTracking();
      trackingRef.current = false;
      if (mountedRef.current) setTracking(false);
      log.info('GPS tracking stopped', { status });
    }
  }, []);

  // ── Fetch rider + performance ────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const [riderRes, perfRes] = await Promise.allSettled([
        ridersAPI.getById(user.uid),
        ridersAPI.getPerformance(user.uid),
      ]);
      if (!mountedRef.current) return;

      if (riderRes.status === 'fulfilled') {
        const rd = riderRes.value.data?.data || riderRes.value.data;
        setRiderData(rd);
        updateRider(rd);
        const status = rd?.riderAvailabilityStatus || rd?.status;
        handleTrackingForStatus(status);
        log.info('Rider data loaded', { status });
      } else {
        log.error('Failed to load rider data', riderRes.reason);
        toast.error('Failed to load rider data');
      }

      if (perfRes.status === 'fulfilled') {
        setPerformance(perfRes.value.data?.data || perfRes.value.data);
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [user?.uid, handleTrackingForStatus, updateRider]);

  // ── Initial fetch + warmup GPS ───────────────────────────────────────────
  useEffect(() => {
    fetchData();
    warmupGPS();
  }, [fetchData]);

  // ── Real-time rider updates (admin KYC/onboarding changes) ───────────────
  useEffect(() => {
    const onRiderUpdated = (e) => {
      const updated = e.detail;
      const rid = updated?.riderUid || updated?.uid || updated?.id;
      if (!rid || rid !== user?.uid) return;
      const rd = updated.rider || updated;
      if (!mountedRef.current) return;
      setRiderData(prev => prev ? { ...prev, ...rd } : rd);
      updateRider(rd);
      const status = rd?.riderAvailabilityStatus || rd?.status;
      if (status) handleTrackingForStatus(status);
      log.info('Rider updated via WebSocket', { status });
    };
    window.addEventListener('ws:rider:updated', onRiderUpdated);
    return () => window.removeEventListener('ws:rider:updated', onRiderUpdated);
  }, [user?.uid, handleTrackingForStatus, updateRider]);

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (trackingRef.current) {
        stopTracking();
        trackingRef.current = false; // CRITICAL: allow re-start on remount
      }
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, []);

  // ── Status change actions ────────────────────────────────────────────────
  const changeStatus = useCallback(async (action) => {
    if (!user?.uid) return;

    log.action(`rider_status_change`, { action, riderId: user.uid });

    await guard(async () => {
      let res;
      if (action === 'online')  res = await ridersAPI.goOnline(user.uid);
      else if (action === 'offline') res = await ridersAPI.goOffline(user.uid);
      else if (action === 'break')   res = await ridersAPI.takeBreak(user.uid);
      else if (action === 'resume')  res = await ridersAPI.resume(user.uid);
      else throw new Error(`Unknown status action: ${action}`);

      const updated = res.data?.data || res.data;
      if (updated && mountedRef.current) {
        setRiderData(updated);
        updateRider(updated);
        const status = updated?.riderAvailabilityStatus || updated?.status;
        handleTrackingForStatus(status);
        log.info('Status changed', { action, status });
      }
      toast.success('Status updated');
    }, `status_${action}`);

    // If guard throws, surface it to the user
  }, [user?.uid, guard, handleTrackingForStatus, updateRider]);

  const currentStatus = riderData?.riderAvailabilityStatus || riderData?.status || 'OFFLINE';
  const isOnline = ['ONLINE', 'AVAILABLE', 'BUSY'].includes(currentStatus);
  const loadingStatus = isLoading(`status_online`) || isLoading(`status_offline`)
    || isLoading(`status_break`) || isLoading(`status_resume`);

  return {
    riderData,
    performance,
    loading,
    loadingStatus,
    tracking,
    currentStatus,
    isOnline,
    changeStatus,
    refresh: fetchData,
  };
}
