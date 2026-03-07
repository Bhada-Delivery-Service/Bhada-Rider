/**
 * useActionGuard — Prevents duplicate button clicks from firing multiple
 * API calls (e.g. double-tapping "Accept Order" while driving).
 *
 * Usage:
 *   const { isLoading, guard } = useActionGuard();
 *
 *   // Wrap any async action:
 *   await guard(async () => {
 *     await ordersAPI.accept(id);
 *     toast.success('Accepted!');
 *   });
 *
 *   // In JSX:
 *   <button disabled={isLoading} onClick={() => guard(handleAccept)}>Accept</button>
 *
 * Features:
 *   - Sets loading=true for the duration of the action
 *   - Ignores subsequent clicks while loading (returns early)
 *   - Automatically resets loading on completion or error
 *   - Optional per-key locking: guard(fn, 'accept') allows parallel guards
 *     for different actions while locking the same key independently
 */
import { useRef, useState, useCallback } from 'react';

export function useActionGuard() {
  const [loadingKeys, setLoadingKeys] = useState({});
  const inFlightRef = useRef({});

  const guard = useCallback(async (fn, key = '__default__') => {
    // Already in flight for this key — bail out silently
    if (inFlightRef.current[key]) return;

    inFlightRef.current[key] = true;
    setLoadingKeys(prev => ({ ...prev, [key]: true }));

    try {
      await fn();
    } finally {
      inFlightRef.current[key] = false;
      setLoadingKeys(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }, []);

  const isLoading = useCallback(
    (key = '__default__') => !!loadingKeys[key],
    [loadingKeys]
  );

  // Convenience: is ANY action loading?
  const anyLoading = Object.keys(loadingKeys).length > 0;

  return { guard, isLoading, anyLoading };
}
