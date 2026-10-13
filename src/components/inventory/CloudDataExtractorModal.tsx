import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Cloud,
  Search,
  CheckCircle2,
  Plus,
  ShoppingCart,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Loader2,
  RefreshCw,
  Flame,
  Wheat,
  Dna,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CloudFoodProduct, CLOUD_EXTRACTED_PRODUCTS } from '../../data/cloudDatabaseSeed';
import { InventoryItem } from '../../types/inventory';

interface CloudDataExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToInventory: (item: Partial<InventoryItem>) => void;
  onAddToShoppingList?: (item: { name: string; category?: string; estimatedPrice?: number }) => void;
  initialSearchQuery?: string;
}

export const CloudDataExtractorModal: React.FC<CloudDataExtractorModalProps> = ({
  isOpen,
  onClose,
  onAddToInventory,
  onAddToShoppingList,
  initialSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'github' | 'google'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dietFilter, setDietFilter] = useState<string>('All');
  const [products, setProducts] = useState<CloudFoodProduct[]>(CLOUD_EXTRACTED_PRODUCTS);
  const [isSearchingServer, setIsSearchingServer] = useState(false);
  const [isAiExtracting, setIsAiExtracting] = useState(false);
  const [extractedSuccessId, setExtractedSuccessId] = useState<string | null>(null);
  const [addedShopSuccessId, setAddedShopSuccessId] = useState<string | null>(null);

  // Sync initial search query when opened
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery, isOpen]);

  // Handle live search
  useEffect(() => {
    const runSearch = async () => {
      const q = searchQuery.trim().toLowerCase();

      // Local seed filter
      let localFiltered = CLOUD_EXTRACTED_PRODUCTS.filter((item) => {
        const matchQ =
          !q ||
          item.productName.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.barcode.includes(q) ||
          item.category.toLowerCase().includes(q);

        const matchSource =
          sourceFilter === 'all' ||
          (sourceFilter === 'github' && item.source === 'github_openfood') ||
          (sourceFilter === 'google' && item.source === 'google_cloud_dataset');

        const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
        const matchDiet = dietFilter === 'All' || item.dietaryType === dietFilter;

        return matchQ && matchSource && matchCat && matchDiet;
      });

      // If user typed a barcode or specific query not found in seed, query backend
      if (localFiltered.length === 0 && q.length > 2) {
        setIsSearchingServer(true);
        try {
          const res = await fetch('/api/cloud-products/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: q,
              category: selectedCategory,
              sourceFilter,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.products && data.products.length > 0) {
              setProducts(data.products);
              setIsSearchingServer(false);
              return;
            }
          }
        } catch (err) {
          console.warn('Server search fallback:', err);
        } finally {
          setIsSearchingServer(false);
        }
      }

      setProducts(localFiltered);
    };

    const timer = setTimeout(runSearch, 150);
    return () => clearTimeout(timer);
  }, [searchQuery, sourceFilter, selectedCategory, dietFilter]);

  // AI Deep Extract on Google Cloud for uncatalogued custom food
  const handleAiDeepExtract = async () => {
    if (!searchQuery.trim()) return;
    setIsAiExtracting(true);
    try {
      const isBarcode = /^\d{4,14}$/.test(searchQuery.trim());
      const res = await fetch('/api/cloud-products/extract-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: !isBarcode ? searchQuery.trim() : '',
          barcode: isBarcode ? searchQuery.trim() : '',
        }),
      });

      if (res.ok) {
        const item = await res.json();
        setProducts([item, ...products]);
        setExtractedSuccessId(item.id);
        setTimeout(() => setExtractedSuccessId(null), 3000);
      }
    } catch (e) {
      console.warn('AI extraction failed:', e);
    } finally {
      setIsAiExtracting(false);
    }
  };

  const handleExtractToInventory = (product: CloudFoodProduct) => {
    const today = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(today.getDate() + (product.shelfLifeDays || 7));

    const itemPayload: Partial<InventoryItem> = {
      productName: product.productName,
      category: (product.category as any) || 'Fresh Produce',
      storageLocation: product.storageLocation || 'Fridge',
      quantity: 1,
      unit: product.typicalUnit || 'pieces',
      manufactureDate: today.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      barcode: product.barcode,
      cost: product.estimatedPriceUSD || 3.5,
      dietaryType: (product.dietaryType as any) || 'Vegetarian',
      notes: `Extracted from ${product.source === 'github_openfood' ? 'GitHub OpenFood Repository' : 'Google Cloud Dataset'}. ${product.storageTip}`,
    };

    onAddToInventory(itemPayload);
    setExtractedSuccessId(product.id);
    setTimeout(() => setExtractedSuccessId(null), 2500);
  };

  const handleAddToShopping = (product: CloudFoodProduct) => {
    if (onAddToShoppingList) {
      onAddToShoppingList({
        name: product.productName,
        category: product.category,
        estimatedPrice: product.estimatedPriceUSD,
      });
      setAddedShopSuccessId(product.id);
      setTimeout(() => setAddedShopSuccessId(null), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-sky-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* --- LIGHT THEME MOVING CLOUDS HEADER --- */}
        <div className="relative overflow-hidden bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400 p-5 sm:p-6 text-white border-b border-sky-300/50">
          {/* Animated moving clouds inside header */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
            <div className="absolute -top-4 w-72 opacity-40 animate-cloud-slow">
              <svg viewBox="0 0 100 45" className="w-full text-white fill-current">
                <path d="M20 35 Q10 35 10 25 Q10 15 22 15 Q25 8 38 8 Q50 8 55 17 Q65 10 75 18 Q85 18 85 28 Q92 28 92 35 Z" />
              </svg>
            </div>
            <div className="absolute top-2 w-64 opacity-50 animate-cloud-medium">
              <svg viewBox="0 0 100 45" className="w-full text-sky-100 fill-current">
                <path d="M15 32 Q8 32 8 22 Q8 14 18 14 Q22 6 34 6 Q44 6 49 14 Q58 8 68 15 Q76 15 76 25 Q82 25 82 32 Z" />
              </svg>
            </div>
          </div>

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-sky-900 mb-2 border border-white/30">
                <Cloud className="w-3.5 h-3.5 text-white" />
                <span className="text-white">Cloud Open Data Repository</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Database className="w-6 h-6" />
                <span>GitHub & Google Cloud Food Extractor</span>
              </h3>
              <p className="text-xs sm:text-sm text-sky-50 mt-1 max-w-xl font-medium">
                Direct access to verified food nutrition, barcodes, shelf-life, and storage rules extracted from GitHub OpenFood Facts and Google Cloud public datasets.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Source Filter Tabs */}
          <div className="relative z-10 mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                sourceFilter === 'all'
                  ? 'bg-white text-sky-800 shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              All Data Sources ({CLOUD_EXTRACTED_PRODUCTS.length}+)
            </button>
            <button
              onClick={() => setSourceFilter('github')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                sourceFilter === 'github'
                  ? 'bg-white text-emerald-800 shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>GitHub OpenFood Repo</span>
            </button>
            <button
              onClick={() => setSourceFilter('google')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                sourceFilter === 'google'
                  ? 'bg-white text-blue-800 shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-300" />
              <span>Google Cloud Datasets</span>
            </button>
          </div>
        </div>

        {/* --- SEARCH & FILTER BAR --- */}
        <div className="p-4 bg-sky-50/50 dark:bg-slate-800/50 border-b border-sky-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name, brand, or barcode (e.g. 8901262010015, milk, oats)..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="All">All Categories</option>
            <option value="Dairy & Eggs">Dairy & Eggs</option>
            <option value="Fresh Produce">Fresh Produce</option>
            <option value="Pantry & Grains">Pantry & Grains</option>
            <option value="Bakery">Bakery</option>
            <option value="Meat & Seafood">Meat & Seafood</option>
            <option value="Beverages">Beverages</option>
            <option value="Frozen">Frozen</option>
            <option value="Snacks & Sweets">Snacks & Sweets</option>
            <option value="Condiments & Sauces">Condiments & Sauces</option>
          </select>

          {/* Diet Filter */}
          <select
            value={dietFilter}
            onChange={(e) => setDietFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="All">All Diets</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
          </select>
        </div>

        {/* --- PRODUCTS LIST VIEW --- */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
          {isSearchingServer && (
            <div className="flex items-center justify-center py-6 text-sky-600 text-xs font-semibold gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Querying live GitHub OpenFood and Google Cloud data APIs...</span>
            </div>
          )}

          {products.length === 0 && !isSearchingServer && (
            <div className="text-center py-10 px-4">
              <Cloud className="w-12 h-12 text-sky-300 mx-auto mb-2" />
              <h4 className="text-base font-bold text-slate-700 dark:text-slate-200">
                No matching product in local cache
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Would you like Google Cloud AI to deep-extract nutritional information, storage rules, and shelf-life for "{searchQuery}"?
              </p>
              <button
                onClick={handleAiDeepExtract}
                disabled={isAiExtracting}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-sky-600/30 transition-all disabled:opacity-50"
              >
                {isAiExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting via Google Cloud...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Deep Extract via Google Cloud AI</span>
                  </>
                )}
              </button>
            </div>
          )}

          {products.map((item) => {
            const isJustExtracted = extractedSuccessId === item.id;
            const isJustAddedShop = addedShopSuccessId === item.id;

            return (
              <div
                key={item.id}
                className="pt-4 first:pt-0 group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white hover:bg-sky-50/60 dark:bg-slate-900 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-sky-200 transition-all"
              >
                {/* Item Details */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Source Badge */}
                    {item.source === 'github_openfood' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        GitHub OpenFood Repo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Google Cloud Dataset
                      </span>
                    )}

                    {/* Barcode Chip */}
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                      Code: {item.barcode}
                    </span>

                    {/* Dietary Type */}
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      • {item.dietaryType}
                    </span>

                    {item.ecoScore && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Eco: {item.ecoScore}
                      </span>
                    )}
                  </div>

                  {/* Title & Brand */}
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Brand: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.brand}</span> | Category: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.category}</span>
                    </p>
                  </div>

                  {/* Nutrients Line */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                      <Flame className="w-3.5 h-3.5" />
                      {item.nutrients.calories} kcal/100g
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                      <Dna className="w-3.5 h-3.5" />
                      {item.nutrients.protein}g Protein
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <Wheat className="w-3.5 h-3.5" />
                      {item.nutrients.carbs}g Carbs
                    </span>
                    <span className="text-slate-500">
                      • {item.nutrients.fat}g Fat • {item.nutrients.fiber}g Fiber
                    </span>
                  </div>

                  {/* Storage & Shelf-Life Info */}
                  <p className="text-[11px] text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-2.5 py-1 rounded-lg border border-sky-100 dark:border-sky-900/40">
                    💡 <strong>Storage:</strong> {item.storageLocation} ({item.shelfLifeDays} days shelf-life) — {item.storageTip}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => handleExtractToInventory(item)}
                    className={`flex-1 sm:flex-none w-full flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      isJustExtracted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-sky-600 hover:bg-sky-500 text-white hover:shadow-md hover:shadow-sky-600/30'
                    }`}
                  >
                    {isJustExtracted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Extracted!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add to Inventory</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleAddToShopping(item)}
                    className={`flex-1 sm:flex-none w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isJustAddedShop
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isJustAddedShop ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Added to Shop</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5 text-slate-500" />
                        <span>Restock Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- MODAL FOOTER --- */}
        <div className="p-4 bg-sky-50 dark:bg-slate-800/80 border-t border-sky-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Open database content synced from GitHub open-source repositories and Google Cloud Vision AI.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
