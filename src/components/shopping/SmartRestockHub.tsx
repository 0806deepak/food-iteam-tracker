import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../../types/inventory';
import {
  SHOPPING_PLATFORMS,
  ShoppingPlatform,
  PlatformCategory,
  getRecommendedPlatformsForCategory,
} from '../../data/shoppingPlatforms';
import {
  PurchaseRecord,
  loadPurchaseHistory,
  recordNewPurchase,
} from '../../lib/purchaseHistoryStorage';
import {
  Search,
  ExternalLink,
  Zap,
  ShoppingBag,
  Clock,
  Star,
  Sparkles,
  ArrowRight,
  History,
  TrendingDown,
  DollarSign,
  Package,
  CheckCircle2,
  Filter,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface SmartRestockHubProps {
  inventoryItems: InventoryItem[];
  onAddRestockedItem: (item: Partial<InventoryItem>) => void;
}

export const SmartRestockHub: React.FC<SmartRestockHubProps> = ({
  inventoryItems,
  onAddRestockedItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseRecord[]>(() =>
    loadPurchaseHistory()
  );
  const [selectedQuickProduct, setSelectedQuickProduct] = useState<string | null>(null);
  const [isLoggedSuccess, setIsLoggedSuccess] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => setPurchaseHistory(loadPurchaseHistory());
    window.addEventListener('purchase_history_updated', handleUpdate);
    return () => window.removeEventListener('purchase_history_updated', handleUpdate);
  }, []);

  // Items that are low in stock (quantity <= 1) or expiring in <= 2 days
  const lowOrEmptyItems = inventoryItems.filter((item) => {
    const diffDays =
      (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return item.quantity <= 1 || diffDays <= 2;
  });

  // Filter platforms by category tab
  const filteredPlatforms = SHOPPING_PLATFORMS.filter((platform) => {
    if (selectedCategory === 'all') return true;
    return platform.category === selectedCategory;
  });

  // Effective query for multi-store price check
  const activeSearchTerm = searchQuery.trim() || selectedQuickProduct || '';

  // Quick purchase logging helper
  const handleLogQuickPurchase = (productName: string, store: ShoppingPlatform) => {
    const today = new Date().toISOString().split('T')[0];
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 10);

    // 1. Record in background purchase history
    recordNewPurchase({
      productName,
      category: store.categoryLabel,
      quantity: 1,
      unit: 'pieces',
      price: 4.5,
      storeName: store.name,
      storeUrl: store.url,
      reorderIntervalDays: 5,
      status: 'delivered',
    });

    // 2. Add back to live inventory
    onAddRestockedItem({
      productName,
      category:
        store.category === 'farm_dairy_meat'
          ? 'Dairy & Eggs'
          : store.category === 'food_ordering'
          ? 'Snacks & Sweets'
          : 'Pantry & Grains',
      quantity: 1,
      unit: 'pieces',
      storageLocation: store.category === 'farm_dairy_meat' ? 'Fridge' : 'Pantry',
      manufactureDate: today,
      expiryDate: expDate.toISOString().split('T')[0],
      cost: 4.5,
    });

    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}

    setIsLoggedSuccess(productName);
    setTimeout(() => setIsLoggedSuccess(null), 3000);
  };

  const totalSpent = purchaseHistory.reduce((acc, p) => acc + (p.price || 0), 0);

  return (
    <div className="space-y-6">
      {/* Hero Header with Natural Fresh Groceries Photo & Animations */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-emerald-500/30 text-white shadow-2xl">
        {/* Background Image with rich natural food photography */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80"
            alt="Fresh colorful organic fruits, vegetables, and pantry items"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-teal-900/90 to-slate-950/85" />
        </div>

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md text-xs font-semibold text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Smart Reorder & Best Price Comparison Hub</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Shop Empty Products at Best Price & Fastest Delivery
            </h2>

            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Find the best rated, chemical-free and lowest price groceries across 30+ verified food ordering, 10-minute quick grocery, and organic farm direct delivery apps. Automatic background tracking records what you buy!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-emerald-200/90">
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-xl">
                ⚡ 10-Min Delivery: Blinkit, Zepto, Swiggy Instamart
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-xl">
                🥛 Pure Farm Dairy & Meat: Country Delight, Akshayakalpa, Licious
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-xl">
                🍕 Top Food Delivery: Swiggy, Zomato, Domino's, EatSure
              </span>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex md:flex-col gap-2.5 flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 min-w-[130px] text-center">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block">
                Tracked Orders
              </span>
              <span className="text-2xl font-black text-white">{purchaseHistory.length}</span>
              <span className="text-[10px] text-emerald-200/80 block">in history record</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 min-w-[130px] text-center">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block">
                Total Restocked
              </span>
              <span className="text-2xl font-black text-white">${totalSpent.toFixed(2)}</span>
              <span className="text-[10px] text-emerald-200/80 block">background logged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty / Depleted Items Alert Carousel */}
      {lowOrEmptyItems.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 border border-amber-200 dark:border-amber-900/50 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Empty / Low Stock Grocery Alert ({lowOrEmptyItems.length} items)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
                    Restock Suggested
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any item below to compare prices across Blinkit, Zepto, BigBasket, and specialty stores
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {lowOrEmptyItems.map((item) => {
              const recommended = getRecommendedPlatformsForCategory(item.category);
              const isSelected = selectedQuickProduct === item.productName;

              return (
                <div
                  key={item.id}
                  className={`flex-shrink-0 p-3.5 rounded-2xl border transition-all w-64 flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <strong className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                        {item.productName}
                      </strong>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-100/70 dark:bg-amber-950/80 px-1.5 py-0.5 rounded flex-shrink-0">
                        {item.quantity} left
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-2">
                      {item.category} • Expires {item.expiryDate}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <button
                      onClick={() => {
                        setSelectedQuickProduct(item.productName);
                        setSearchQuery(item.productName);
                      }}
                      className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Search className="w-3 h-3" />
                      <span>Compare Prices Online</span>
                    </button>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 justify-center">
                      <span>Quick stores: </span>
                      {recommended.slice(0, 3).map((p) => (
                        <a
                          key={p.id}
                          href={p.getSearchUrl(item.productName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          {p.name.split(' ')[0]}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Multi-Store Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Search Any Food Product Across Online Stores</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Type any grocery or meal item to generate 1-click order links across all 30+ platforms
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedQuickProduct(null);
            }}
            placeholder="Search milk, paneer, eggs, chicken, biryani, sourdough, spinach, apples..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500">
          <span>Try quick searches:</span>
          {['Organic Milk', 'Fresh Paneer', 'Chicken Breast', 'Eggs (12pk)', 'Basmati Rice', 'Pizza', 'Avocados', 'Greek Yogurt'].map(
            (term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  setSelectedQuickProduct(term);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {term}
              </button>
            )
          )}
        </div>

        {/* Success toast after logging restock */}
        {isLoggedSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Restocked "{isLoggedSuccess}" and recorded in purchase history!
            </span>
            <span className="text-[11px] opacity-75">Added to fridge with fresh 10-day shelf life</span>
          </div>
        )}
      </div>

      {/* Multi-Store Online Cards Section */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All 30+ Platforms', icon: '🌐' },
              { id: 'quick_grocery', label: '⚡ 10-Min & Supermarket Grocery', icon: '🛒' },
              { id: 'farm_dairy_meat', label: '🥛 Farm Dairy, Meat & Veg', icon: '🥩' },
              { id: 'food_ordering', label: '🍕 Food & Restaurant Ordering', icon: '🍽️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === tab.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 self-end sm:self-auto">
            Showing {filteredPlatforms.length} verified platforms
          </span>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlatforms.map((platform) => {
            const searchUrl = activeSearchTerm
              ? platform.getSearchUrl(activeSearchTerm)
              : platform.url;

            return (
              <motion.div
                key={platform.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon, Name, Rating, Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 select-none">
                        {platform.iconEmoji}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                          {platform.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {platform.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/40 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{platform.rating}</span>
                    </div>
                  </div>

                  {/* Delivery Speed Badge & Specialty */}
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {platform.deliveryTime}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {platform.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {platform.specialty}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>
                      {activeSearchTerm ? `Search "${activeSearchTerm.slice(0, 16)}"` : 'Shop on Platform'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Restock record shortcut */}
                  <button
                    onClick={() =>
                      handleLogQuickPurchase(activeSearchTerm || 'Organic Grocery Item', platform)
                    }
                    className="w-full py-1.5 rounded-xl text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Log Restock to Inventory & History</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Background Purchase & Reorder History Record */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Purchase & Reorder Background History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Data records of items bought, store sources, costs, and consumption cycles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs self-start sm:self-auto">
            <span className="text-slate-400">
              Total Recorded: <strong className="text-slate-900 dark:text-white">${totalSpent.toFixed(2)}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px]">
              {purchaseHistory.length} orders
            </span>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Store Platform</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Cost ($)</th>
                <th className="py-2.5 px-3">Reorder Cycle</th>
                <th className="py-2.5 px-3">Date Bought</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {purchaseHistory.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {rec.productName}
                  </td>
                  <td className="py-3 px-3">
                    <a
                      href={rec.storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium inline-flex items-center gap-1"
                    >
                      <span>{rec.storeName}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {rec.quantity} {rec.unit}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    ${rec.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                      Every {rec.reorderIntervalDays || 7} days
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">
                    {new Date(rec.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <a
                      href={rec.storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors inline-block"
                    >
                      Reorder
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
