import { InventoryItem, ExpiryInfo } from '../types/inventory';

/**
 * Normalizes a date string or Date object to midnight UTC/local for reliable day comparison
 */
export function normalizeDate(dateInput: string | Date): Date {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : new Date(dateInput);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Calculates number of full calendar days until expiry relative to referenceDate (defaults to today)
 */
export function getDaysUntilExpiry(expiryDate: string, referenceDate?: Date): number {
  if (!expiryDate) return 0;
  const target = normalizeDate(expiryDate);
  const base = normalizeDate(referenceDate || new Date());
  const diffTime = target.getTime() - base.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determines expiry badge details, label, and category status
 */
export function getExpiryStatus(expiryDate: string, referenceDate?: Date): ExpiryInfo {
  const daysLeft = getDaysUntilExpiry(expiryDate, referenceDate);
  const isExpiringThisWeek = daysLeft >= 0 && daysLeft <= 7;

  if (daysLeft < 0) {
    const absDays = Math.abs(daysLeft);
    return {
      status: 'expired',
      label: absDays === 1 ? 'Expired yesterday' : `Expired ${absDays} days ago`,
      daysLeft,
      color: 'red',
      badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      isExpiringThisWeek: false,
    };
  }

  if (daysLeft === 0) {
    return {
      status: 'critical',
      label: 'Expires today!',
      daysLeft: 0,
      color: 'red',
      badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse',
      isExpiringThisWeek: true,
    };
  }

  if (daysLeft <= 3) {
    return {
      status: 'critical',
      label: `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left!`,
      daysLeft,
      color: 'orange',
      badgeClass: 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      isExpiringThisWeek: true,
    };
  }

  if (daysLeft <= 7) {
    return {
      status: 'warning',
      label: `${daysLeft} days left`,
      daysLeft,
      color: 'yellow',
      badgeClass: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950/70 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800',
      isExpiringThisWeek: true,
    };
  }

  return {
    status: 'fresh',
    label: `${daysLeft} days left`,
    daysLeft,
    color: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    isExpiringThisWeek: false,
  };
}

/**
 * Checks if an item expires within the next 7 calendar days
 */
export function isExpiringThisWeek(expiryDate: string, referenceDate?: Date): boolean {
  const days = getDaysUntilExpiry(expiryDate, referenceDate);
  return days >= 0 && days <= 7;
}

/**
 * Main reusable filter function for inventory items
 */
export function filterInventory(
  items: InventoryItem[],
  search: string = '',
  category: string = 'All',
  status: string = 'All',
  expiringThisWeekOnly: boolean = false,
  storageLocation: string = 'All',
  dietaryType: string = 'All',
  referenceDate?: Date
): InventoryItem[] {
  const searchTrim = search.trim().toLowerCase();

  return items.filter((item) => {
    // 1. Text Search (Product Name, Category, Storage, Barcode, Notes)
    if (searchTrim) {
      const matchName = item.productName.toLowerCase().includes(searchTrim);
      const matchCategory = item.category.toLowerCase().includes(searchTrim);
      const matchStorage = item.storageLocation.toLowerCase().includes(searchTrim);
      const matchBarcode = item.barcode ? item.barcode.toLowerCase().includes(searchTrim) : false;
      const matchNotes = item.notes ? item.notes.toLowerCase().includes(searchTrim) : false;

      if (!matchName && !matchCategory && !matchStorage && !matchBarcode && !matchNotes) {
        return false;
      }
    }

    // 2. Category Filter
    if (category && category !== 'All' && item.category !== category) {
      return false;
    }

    // 3. Storage Location Filter
    if (storageLocation && storageLocation !== 'All' && item.storageLocation !== storageLocation) {
      return false;
    }

    // 4. Dietary Type Filter
    if (dietaryType && dietaryType !== 'All' && item.dietaryType !== dietaryType) {
      return false;
    }

    // 5. Expiry Status & Weekly Filter
    const daysLeft = getDaysUntilExpiry(item.expiryDate, referenceDate);
    const expiresThisWeek = daysLeft >= 0 && daysLeft <= 7;

    if (expiringThisWeekOnly && !expiresThisWeek) {
      return false;
    }

    if (status && status !== 'All') {
      const normalizedStatus = status.toLowerCase();
      if (normalizedStatus === 'fresh') {
        if (daysLeft <= 7) return false;
      } else if (normalizedStatus === 'expiring soon' || normalizedStatus === 'warning') {
        if (daysLeft < 0 || daysLeft > 7) return false;
      } else if (normalizedStatus === 'expired') {
        if (daysLeft >= 0) return false;
      } else if (normalizedStatus === 'expiring this week') {
        if (!expiresThisWeek) return false;
      }
    }

    return true;
  });
}
