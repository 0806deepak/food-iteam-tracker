import { useState, useEffect, useCallback } from 'react';
import { InventoryItem } from '../types/inventory';
import {
  findItemsExpiringWithinDays,
  buildExpiryNotificationPayload,
  shouldTriggerDailyCheck,
  markDailyCheckCompleted,
  sendBrowserPushNotification,
} from '../lib/expiryNotificationService';

interface UseExpiryNotificationsOptions {
  enabled?: boolean;
  thresholdDays?: number; // default: 2 days
  onNavigateTab?: (tab: string) => void;
}

export function useExpiryNotifications(
  items: InventoryItem[],
  options: UseExpiryNotificationsOptions = {}
) {
  const { enabled = true, thresholdDays = 2, onNavigateTab } = options;

  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string | null>(null);

  // Filter items expiring within 2 days
  const checkResult = findItemsExpiringWithinDays(items, thresholdDays);
  const { expiringItems, expiredItems, totalExpiringSoonCount } = checkResult;

  // Register Service Worker on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        setIsServiceWorkerReady(true);

        // Listen for messages from service worker (e.g. notification click actions)
        const handleMessage = (event: MessageEvent) => {
          if (event.data?.type === 'NAVIGATE_TAB' && onNavigateTab) {
            onNavigateTab(event.data.tab);
          }
        };
        navigator.serviceWorker.addEventListener('message', handleMessage);
      })
      .catch((err) => {
        console.warn('Service Worker registration skipped or unavailable:', err);
      });
  }, [onNavigateTab]);

  // Request browser notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        // Run check and notify immediately if items are expiring
        checkAndNotify(true);
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
      return false;
    }
  }, [items, thresholdDays]);

  // Main check & notify logic
  const checkAndNotify = useCallback(
    async (force: boolean = false): Promise<boolean> => {
      if (typeof window === 'undefined' || !('Notification' in window)) return false;

      // Update current permission state
      const currentPerm = Notification.permission;
      setPermission(currentPerm);

      if (currentPerm !== 'granted') return false;
      if (!enabled) return false;

      // Check whether daily check should run
      if (!shouldTriggerDailyCheck(force) && !force) {
        return false;
      }

      const { expiringItems: soonItems, expiredItems: pastItems } = findItemsExpiringWithinDays(
        items,
        thresholdDays
      );

      // Only trigger notification if there are items expiring within 2 days (or expired)
      if (soonItems.length === 0 && pastItems.length === 0 && !force) {
        markDailyCheckCompleted();
        setLastCheckTime(new Date().toLocaleTimeString());
        return false;
      }

      const { title, options: notificationOptions } = buildExpiryNotificationPayload(
        soonItems,
        pastItems
      );

      const dispatched = await sendBrowserPushNotification(title, notificationOptions);

      if (dispatched) {
        markDailyCheckCompleted();
        setLastCheckTime(new Date().toLocaleTimeString());
      }

      return dispatched;
    },
    [items, enabled, thresholdDays]
  );

  // Trigger test notification
  const triggerTestNotification = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;

    if (Notification.permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    const { title, options: notificationOptions } = buildExpiryNotificationPayload(
      expiringItems.length > 0 ? expiringItems : items.slice(0, 2)
    );

    return sendBrowserPushNotification(
      `🔔 [Test Alert] ${title}`,
      {
        ...notificationOptions,
        body: `Test Expiry Check: ${notificationOptions.body}`,
      }
    );
  }, [items, expiringItems, requestPermission]);

  // Automatically perform daily check on mount and whenever items change
  useEffect(() => {
    if (enabled && permission === 'granted') {
      checkAndNotify(false);
    }
  }, [enabled, permission, checkAndNotify]);

  // Daily interval timer (checks every 4 hours in background while app is open)
  useEffect(() => {
    const interval = setInterval(() => {
      if (enabled && permission === 'granted') {
        checkAndNotify(false);
      }
    }, 4 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [enabled, permission, checkAndNotify]);

  return {
    permission,
    isSupported: typeof window !== 'undefined' && 'Notification' in window,
    isServiceWorkerReady,
    expiringWithinTwoDays: expiringItems,
    expiredItems,
    totalExpiringSoonCount,
    lastCheckTime,
    requestPermission,
    checkAndNotify,
    triggerTestNotification,
  };
}
