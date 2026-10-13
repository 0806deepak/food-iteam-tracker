import { InventoryItem } from '../types/inventory';
import { getDaysUntilExpiry } from './inventoryFilters';

export interface ExpiryCheckResult {
  expiringItems: InventoryItem[];
  expiredItems: InventoryItem[];
  totalExpiringSoonCount: number;
}

const LAST_CHECK_DATE_KEY = 'food_tracker_last_daily_expiry_check_v1';
const NOTIFIED_ITEMS_KEY = 'food_tracker_notified_items_v1';

/**
 * Filters items expiring within a given threshold (default: 2 days)
 */
export function findItemsExpiringWithinDays(
  items: InventoryItem[],
  thresholdDays: number = 2,
  referenceDate?: Date
): ExpiryCheckResult {
  const expiringItems: InventoryItem[] = [];
  const expiredItems: InventoryItem[] = [];

  items.forEach((item) => {
    const daysLeft = getDaysUntilExpiry(item.expiryDate, referenceDate);
    if (daysLeft >= 0 && daysLeft <= thresholdDays) {
      expiringItems.push(item);
    } else if (daysLeft < 0) {
      expiredItems.push(item);
    }
  });

  return {
    expiringItems,
    expiredItems,
    totalExpiringSoonCount: expiringItems.length,
  };
}

/**
 * Formats a clean, readable notification title and body
 */
export function buildExpiryNotificationPayload(
  expiringItems: InventoryItem[],
  expiredItems: InventoryItem[] = []
): { title: string; options: NotificationOptions } {
  const count = expiringItems.length;

  let title = '';
  let body = '';

  if (count === 1) {
    const item = expiringItems[0];
    const days = getDaysUntilExpiry(item.expiryDate);
    const when = days === 0 ? 'today' : days === 1 ? 'tomorrow' : 'in 2 days';
    title = `⚠️ Urgent Expiry: ${item.productName}`;
    body = `${item.productName} (${item.quantity} ${item.unit}) expires ${when}! Tap to view AI recipe ideas or mark consumed.`;
  } else if (count > 1) {
    title = `⚠️ ${count} Food Items Expiring Within 2 Days!`;
    const names = expiringItems
      .slice(0, 3)
      .map((i) => {
        const d = getDaysUntilExpiry(i.expiryDate);
        return `${i.productName} (${d === 0 ? 'today' : `${d}d`})`;
      })
      .join(', ');
    const more = count > 3 ? ` + ${count - 3} more` : '';
    body = `Expiring soon: ${names}${more}. Cook them now to prevent food waste!`;
  } else if (expiredItems.length > 0) {
    title = `❌ ${expiredItems.length} Food Item(s) Expired`;
    body = `Please check your pantry/fridge to compost or remove ${expiredItems[0].productName}.`;
  } else {
    title = `✅ All Food Items Fresh`;
    body = `No items are expiring in the next 2 days. Great job managing your pantry!`;
  }

  const options: any = {
    body,
    icon: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=192&auto=format&fit=crop&q=80',
    badge: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=96&auto=format&fit=crop&q=80',
    tag: `expiry-check-${new Date().toISOString().split('T')[0]}`,
    renotify: true,
    requireInteraction: true,
    data: '/',
  };

  return { title, options };
}

/**
 * Determines whether daily check has already run today
 */
export function shouldTriggerDailyCheck(forced: boolean = false): boolean {
  if (forced) return true;
  if (typeof window === 'undefined') return false;

  const todayStr = new Date().toISOString().split('T')[0];
  const lastCheckedDate = localStorage.getItem(LAST_CHECK_DATE_KEY);

  return lastCheckedDate !== todayStr;
}

/**
 * Records that today's check has completed
 */
export function markDailyCheckCompleted(): void {
  if (typeof window === 'undefined') return;
  const todayStr = new Date().toISOString().split('T')[0];
  localStorage.setItem(LAST_CHECK_DATE_KEY, todayStr);
}

/**
 * Triggers native browser push notification via Service Worker or Notification API
 */
export async function sendBrowserPushNotification(
  title: string,
  options: NotificationOptions
): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Notifications not supported in this browser environment');
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    // 1. Prefer Service Worker registration if available
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration && 'showNotification' in registration) {
        await registration.showNotification(title, options);
        return true;
      }
    }

    // 2. Fallback to standard Notification instance
    new Notification(title, options);
    return true;
  } catch (error) {
    console.warn('Failed to dispatch browser notification:', error);
    try {
      new Notification(title, options);
      return true;
    } catch (e) {
      return false;
    }
  }
}
