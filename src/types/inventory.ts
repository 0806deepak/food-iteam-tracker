export type StorageLocation = 'Fridge' | 'Freezer' | 'Pantry' | 'Counter';

export type DietaryType = 'Vegetarian' | 'Vegan' | 'Non-Vegetarian';

export type Category = 
  | 'Dairy & Eggs'
  | 'Fresh Produce'
  | 'Bakery'
  | 'Meat & Seafood'
  | 'Pantry & Grains'
  | 'Beverages'
  | 'Frozen'
  | 'Snacks & Sweets'
  | 'Condiments & Sauces';

export interface InventoryItem {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  storageLocation: StorageLocation;
  manufactureDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  barcode?: string;
  cost?: number;
  dietaryType?: DietaryType;
  notes?: string;
  isConsumed?: boolean;
  isWasted?: boolean;
  consumedAt?: string;
  wastedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpiryStatus = 'fresh' | 'warning' | 'critical' | 'expired';

export interface ExpiryInfo {
  status: ExpiryStatus;
  label: string;
  daysLeft: number;
  color: string;
  badgeClass: string;
  isExpiringThisWeek: boolean;
}

export type SortField = 'expiryDate' | 'manufactureDate' | 'productName' | 'quantity' | 'category' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface InventoryFilterOptions {
  search: string;
  category: string;
  status: string; // 'All' | 'Fresh' | 'Expiring Soon' | 'Expired' | 'Expiring This Week'
  expiringThisWeekOnly?: boolean;
  storageLocation?: string;
  dietaryType?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dietaryPreference: 'All' | 'Vegetarian' | 'Vegan' | 'Non-Vegetarian' | 'Gluten-Free';
  notificationsEnabled: boolean;
  alertDaysBefore: number; // e.g. 3 days before
  cloudSyncEnabled: boolean;
  isVerified: boolean;
  avatarUrl?: string;
}

export interface RecipeNutrition {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams?: number;
}

export interface Recipe {
  id: string;
  title: string;
  cuisine: string;
  dietaryType: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  description: string;
  ingredientsFromInventory: string[];
  pantryStaplesNeeded: string[];
  instructions: string[];
  nutritionPerServing: RecipeNutrition;
  chefTip: string;
}
