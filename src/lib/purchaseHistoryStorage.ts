export interface PurchaseRecord {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  storeName: string;
  storeUrl: string;
  purchaseDate: string; // ISO string
  reorderIntervalDays?: number;
  status: 'delivered' | 'ordered' | 'replenished';
}

const PURCHASE_HISTORY_KEY = 'food_tracker_purchase_history_v1';

export const INITIAL_PURCHASE_HISTORY: PurchaseRecord[] = [
  {
    id: 'pr-1',
    productName: 'Organic Whole Milk',
    category: 'Dairy & Eggs',
    quantity: 2,
    unit: 'liters',
    price: 8.58,
    storeName: 'Country Delight',
    storeUrl: 'https://countrydelight.in/',
    purchaseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reorderIntervalDays: 4,
    status: 'delivered',
  },
  {
    id: 'pr-2',
    productName: 'Baby Spinach Fresh Greens',
    category: 'Fresh Produce',
    quantity: 200,
    unit: 'g',
    price: 3.49,
    storeName: 'Zepto',
    storeUrl: 'https://www.zepto.com/',
    purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reorderIntervalDays: 6,
    status: 'delivered',
  },
  {
    id: 'pr-3',
    productName: 'Chicken Breast Fillet',
    category: 'Meat & Seafood',
    quantity: 500,
    unit: 'g',
    price: 7.99,
    storeName: 'Licious',
    storeUrl: 'https://www.licious.in/',
    purchaseDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    reorderIntervalDays: 7,
    status: 'delivered',
  },
  {
    id: 'pr-4',
    productName: 'Royal Basmati Rice (5kg)',
    category: 'Pantry & Grains',
    quantity: 1,
    unit: 'packs',
    price: 14.50,
    storeName: 'BigBasket',
    storeUrl: 'https://www.bigbasket.com/',
    purchaseDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    reorderIntervalDays: 30,
    status: 'delivered',
  },
  {
    id: 'pr-5',
    productName: 'Fresh Sourdough Bread',
    category: 'Bakery',
    quantity: 1,
    unit: 'pieces',
    price: 4.50,
    storeName: 'Blinkit',
    storeUrl: 'https://blinkit.com/',
    purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reorderIntervalDays: 4,
    status: 'delivered',
  },
];

export function loadPurchaseHistory(): PurchaseRecord[] {
  try {
    const raw = localStorage.getItem(PURCHASE_HISTORY_KEY);
    if (!raw) {
      savePurchaseHistory(INITIAL_PURCHASE_HISTORY);
      return INITIAL_PURCHASE_HISTORY;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PURCHASE_HISTORY;
  } catch (e) {
    return INITIAL_PURCHASE_HISTORY;
  }
}

export function savePurchaseHistory(records: PurchaseRecord[]): void {
  try {
    localStorage.setItem(PURCHASE_HISTORY_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event('purchase_history_updated'));
  } catch (e) {
    console.warn('Failed to save purchase history:', e);
  }
}

export function recordNewPurchase(record: Omit<PurchaseRecord, 'id' | 'purchaseDate'>): PurchaseRecord {
  const current = loadPurchaseHistory();
  const newEntry: PurchaseRecord = {
    ...record,
    id: `pr_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    purchaseDate: new Date().toISOString(),
    status: 'delivered',
  };

  const updated = [newEntry, ...current];
  savePurchaseHistory(updated);
  return newEntry;
}
