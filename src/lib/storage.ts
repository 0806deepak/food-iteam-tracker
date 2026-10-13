import { InventoryItem, UserProfile } from '../types/inventory';

const INVENTORY_STORAGE_KEY = 'food_item_tracker_inventory_v1';
const USER_PROFILE_KEY = 'food_item_tracker_profile_v1';
const WASTE_LOG_KEY = 'food_item_tracker_waste_log_v1';
const FIREBASE_CONFIG_KEY = 'food_item_tracker_firebase_config_v1';

export interface WasteRecord {
  id: string;
  itemId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  cost: number;
  date: string;
  reason: 'expired' | 'spoiled' | 'forgotten' | 'other';
}

// Generate realistic dynamic dates based on today's date
function getRelativeDateStr(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'seed-1',
    productName: 'Organic Whole Milk',
    category: 'Dairy & Eggs',
    quantity: 1,
    unit: 'liters',
    storageLocation: 'Fridge',
    manufactureDate: getRelativeDateStr(-8),
    expiryDate: getRelativeDateStr(2), // Expiring in 2 days!
    barcode: '8901262010015',
    cost: 4.29,
    dietaryType: 'Vegetarian',
    notes: 'Keep chilled on top shelf. Great for oatmeal or coffee.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    productName: 'Baby Spinach Leaves',
    category: 'Fresh Produce',
    quantity: 200,
    unit: 'g',
    storageLocation: 'Fridge',
    manufactureDate: getRelativeDateStr(-5),
    expiryDate: getRelativeDateStr(1), // Expiring tomorrow!
    barcode: '041220194821',
    cost: 3.49,
    dietaryType: 'Vegan',
    notes: 'Crisper drawer. Needs to be used in salad or sautéed.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-3',
    productName: 'Greek Plain Yogurt',
    category: 'Dairy & Eggs',
    quantity: 2,
    unit: 'pieces',
    storageLocation: 'Fridge',
    manufactureDate: getRelativeDateStr(-10),
    expiryDate: getRelativeDateStr(4), // Expiring in 4 days
    barcode: '8901030829141',
    cost: 5.99,
    dietaryType: 'Vegetarian',
    notes: 'High protein breakfast base.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-4',
    productName: 'Sourdough Artisan Bread',
    category: 'Bakery',
    quantity: 1,
    unit: 'pieces',
    storageLocation: 'Counter',
    manufactureDate: getRelativeDateStr(-4),
    expiryDate: getRelativeDateStr(3), // Expiring in 3 days
    barcode: '011110853241',
    cost: 5.50,
    dietaryType: 'Vegan',
    notes: 'Can freeze slices if not eaten soon.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-5',
    productName: 'Fresh Strawberries',
    category: 'Fresh Produce',
    quantity: 1,
    unit: 'boxes',
    storageLocation: 'Fridge',
    manufactureDate: getRelativeDateStr(-7),
    expiryDate: getRelativeDateStr(-1), // Expired yesterday!
    barcode: '071110123456',
    cost: 4.99,
    dietaryType: 'Vegan',
    notes: 'Check for soft spots; make strawberry compote if still good.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-6',
    productName: 'Paneer (Indian Cottage Cheese)',
    category: 'Dairy & Eggs',
    quantity: 400,
    unit: 'g',
    storageLocation: 'Fridge',
    manufactureDate: getRelativeDateStr(-6),
    expiryDate: getRelativeDateStr(5), // Expiring in 5 days
    barcode: '8901030456123',
    cost: 6.20,
    dietaryType: 'Vegetarian',
    notes: 'Ideal for Palak Paneer or grilled tikka skewers.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-7',
    productName: 'Boneless Chicken Breast',
    category: 'Meat & Seafood',
    quantity: 2,
    unit: 'pieces',
    storageLocation: 'Freezer',
    manufactureDate: getRelativeDateStr(-20),
    expiryDate: getRelativeDateStr(60), // Fresh in freezer
    barcode: '021000654321',
    cost: 11.50,
    dietaryType: 'Non-Vegetarian',
    notes: 'Vacuum packed in freezer.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-8',
    productName: 'Organic Brown Eggs (12-pack)',
    category: 'Dairy & Eggs',
    quantity: 12,
    unit: 'pieces',
    storageLocation: 'Fridge',
    manufactureDate: getRelativeDateStr(-12),
    expiryDate: getRelativeDateStr(12),
    barcode: '041220987654',
    cost: 4.80,
    dietaryType: 'Vegetarian',
    notes: 'Middle shelf for steady temperature.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-9',
    productName: 'Basmati Rice Premium',
    category: 'Pantry & Grains',
    quantity: 5,
    unit: 'kg',
    storageLocation: 'Pantry',
    manufactureDate: getRelativeDateStr(-60),
    expiryDate: getRelativeDateStr(300),
    barcode: '8901234567890',
    cost: 16.99,
    dietaryType: 'Vegan',
    notes: 'Airtight container in dry pantry.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-10',
    productName: 'Organic Tofu Firm',
    category: 'Pantry & Grains',
    quantity: 1,
    unit: 'packs',
    storageLocation: 'Fridge',
    manufactureDate: getRelativeDateStr(-10),
    expiryDate: getRelativeDateStr(6),
    barcode: '023456789012',
    cost: 3.25,
    dietaryType: 'Vegan',
    notes: 'Great for vegetable stir-fry or curry.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_default_deepak',
  name: 'Deepak Achar',
  email: 'deepakachar0806@gmail.com',
  phone: '+1 (555) 234-5678',
  dietaryPreference: 'All',
  notificationsEnabled: true,
  alertDaysBefore: 3,
  cloudSyncEnabled: true,
  isVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

// Local storage management with error tolerance
export function loadInventoryItems(): InventoryItem[] {
  try {
    const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) {
      saveInventoryItems(INITIAL_INVENTORY_ITEMS);
      return INITIAL_INVENTORY_ITEMS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_INVENTORY_ITEMS;
  } catch (e) {
    console.warn('Failed to load inventory from storage:', e);
    return INITIAL_INVENTORY_ITEMS;
  }
}

export function saveInventoryItems(items: InventoryItem[]): void {
  try {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('inventory_updated'));
  } catch (e) {
    console.warn('Failed to save inventory to storage:', e);
  }
}

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (!raw) {
      saveUserProfile(INITIAL_USER_PROFILE);
      return INITIAL_USER_PROFILE;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event('profile_updated'));
  } catch (e) {
    console.warn('Failed to save user profile:', e);
  }
}

export function loadWasteLog(): WasteRecord[] {
  try {
    const raw = localStorage.getItem(WASTE_LOG_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveWasteRecord(record: WasteRecord): void {
  try {
    const current = loadWasteLog();
    const updated = [record, ...current];
    localStorage.setItem(WASTE_LOG_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('waste_updated'));
  } catch (e) {
    console.warn('Failed to log waste record:', e);
  }
}
