/**
 * useNetworkStatus — Monitors browser online/offline events and
 * shows a toast notification to the rider when connectivity changes.
 *
 * Returns { isOnline: boolean }
 *
 * Usage:
 *   const { isOnline } = useNetworkStatus();
 */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online — reconnecting…', {
        id: 'network-status',
        duration: 3000,
        icon: '🌐',
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('No internet connection', {
        id: 'network-status',
        duration: Infinity,
        icon: '📵',
      });
    };

    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
}
