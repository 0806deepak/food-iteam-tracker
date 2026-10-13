import { Search, Plus, ScanBarcode, Filter, LayoutGrid, LayoutList, X, Sparkles, Refrigerator } from 'lucide-react';
import { Category, StorageLocation, DietaryType } from '../../types/inventory';

interface ToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  storageLocation: string;
  onStorageLocationChange: (value: string) => void;
  dietaryType: string;
  onDietaryTypeChange: (value: string) => void;
  expiringThisWeekOnly: boolean;
  onExpiringThisWeekToggle: () => void;
  viewMode: 'table' | 'grid' | 'fridge';
  onViewModeChange: (mode: 'table' | 'grid' | 'fridge') => void;
  onOpenAddModal: () => void;
  onOpenBarcodeScanner: () => void;
  totalFilteredCount: number;
}

const CATEGORIES: string[] = [
  'All',
  'Dairy & Eggs',
  'Fresh Produce',
  'Bakery',
  'Meat & Seafood',
  'Pantry & Grains',
  'Beverages',
  'Frozen',
  'Snacks & Sweets',
  'Condiments & Sauces',
];

const LOCATIONS: string[] = ['All', 'Fridge', 'Freezer', 'Pantry', 'Counter'];

const STATUSES: { id: string; label: string }[] = [
  { id: 'All', label: 'All Items' },
  { id: 'Expiring This Week', label: '⚠️ Expiring This Week' },
  { id: 'Expiring Soon', label: '⏳ 3-7 Days' },
  { id: 'Fresh', label: '✅ Fresh (>7d)' },
  { id: 'Expired', label: '❌ Expired' },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  storageLocation,
  onStorageLocationChange,
  dietaryType,
  onDietaryTypeChange,
  expiringThisWeekOnly,
  onExpiringThisWeekToggle,
  viewMode,
  onViewModeChange,
  onOpenAddModal,
  onOpenBarcodeScanner,
  totalFilteredCount,
}) => {
  const hasActiveFilters =
    search !== '' ||
    category !== 'All' ||
    status !== 'All' ||
    storageLocation !== 'All' ||
    dietaryType !== 'All' ||
    expiringThisWeekOnly;

  const resetFilters = () => {
    onSearchChange('');
    onCategoryChange('All');
    onStatusChange('All');
    onStorageLocationChange('All');
    onDietaryTypeChange('All');
    if (expiringThisWeekOnly) onExpiringThisWeekToggle();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs mb-5 space-y-3.5">
      {/* Top row: Search, Scan, Add, View toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search food by name, category, barcode, location..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Barcode scanner camera button */}
          <button
            onClick={onOpenBarcodeScanner}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-medium transition-colors shadow-xs"
            title="Scan barcode with camera"
          >
            <ScanBarcode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">Scan Barcode</span>
          </button>

          {/* Add Item button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-sm hover:shadow-emerald-500/20 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Table View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('fridge')}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold ${
                viewMode === 'fridge'
                  ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Virtual Fridge & Shelf View"
            >
              <Refrigerator className="w-4 h-4" />
              <span className="hidden lg:inline text-[11px]">Virtual Fridge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        {/* Status Pill Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUSES.map((st) => {
            const isSelected = status === st.id;
            return (
              <button
                key={st.id}
                onClick={() => onStatusChange(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.filter((c) => c !== 'All').map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Location Dropdown */}
          <select
            value={storageLocation}
            onChange={(e) => onStorageLocationChange(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Storage</option>
            {LOCATIONS.filter((l) => l !== 'All').map((l) => (
              <option key={l} value={l}>
                📍 {l}
              </option>
            ))}
          </select>

          {/* Dietary Dropdown */}
          <select
            value={dietaryType}
            onChange={(e) => onDietaryTypeChange(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Diets</option>
            <option value="Vegetarian">🌱 Vegetarian</option>
            <option value="Vegan">🥑 Vegan</option>
            <option value="Non-Vegetarian">🍗 Non-Veg</option>
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 px-1.5 py-1"
            >
              <X className="w-3 h-3" />
              Reset ({totalFilteredCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
