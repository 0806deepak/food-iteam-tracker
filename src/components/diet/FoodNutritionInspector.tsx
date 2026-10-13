import React, { useState } from 'react';
import { FoodNutritionItem, DietCategory } from '../../types/diet';
import { FOOD_NUTRITION_DATABASE } from '../../data/foodNutritionDatabase';
import { InventoryItem } from '../../types/inventory';
import {
  Search,
  Filter,
  Flame,
  DropletOff,
  Plus,
  ShoppingCart,
  CheckCircle2,
  Wheat,
  Dna,
  Sparkles,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FoodNutritionInspectorProps {
  onAddIngredientToInventory?: (item: Partial<InventoryItem>) => void;
  onAddIngredientToShoppingList?: (name: string, category: string) => void;
}

export const FoodNutritionInspector: React.FC<FoodNutritionInspectorProps> = ({
  onAddIngredientToInventory,
  onAddIngredientToShoppingList,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDiet, setSelectedDiet] = useState<string>('All');
  const [filterZeroOilOnly, setFilterZeroOilOnly] = useState(false);
  const [filterNoFireOnly, setFilterNoFireOnly] = useState(false);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const categories = [
    'All',
    'Sprouts & Pulses',
    'Vegetables & Greens',
    'Nuts & Seeds',
    'Dairy & Plant Milk',
    'Lean Meats & Seafood',
  ];

  const filteredItems = FOOD_NUTRITION_DATABASE.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.superfoodHighlight.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDiet =
      selectedDiet === 'All' || item.dietCategory === selectedDiet;
    const matchesZeroOil = !filterZeroOilOnly || item.isZeroOil;
    const matchesNoFire = !filterNoFireOnly || item.isNoFire;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDiet &&
      matchesZeroOil &&
      matchesNoFire
    );
  });

  const handleAddShopping = (item: FoodNutritionItem) => {
    if (onAddIngredientToShoppingList) {
      onAddIngredientToShoppingList(item.name, item.category);
    }
    setAddedItemNotice(`Added "${item.name}" to Restock Shopping List!`);
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => setAddedItemNotice(null), 2500);
  };

  const handleAddInventory = (item: FoodNutritionItem) => {
    if (onAddIngredientToInventory) {
      const now = new Date();
      const expiry = new Date();
      expiry.setDate(now.getDate() + 7);

      onAddIngredientToInventory({
        productName: item.name,
        category:
          item.category === 'Vegetables & Greens'
            ? 'Fresh Produce'
            : item.category === 'Lean Meats & Seafood'
            ? 'Meat & Seafood'
            : item.category === 'Dairy & Plant Milk'
            ? 'Dairy & Eggs'
            : 'Pantry & Grains',
        quantity: 1,
        unit: 'pack',
        storageLocation: item.isNoFire ? 'Fridge' : 'Pantry',
        manufactureDate: now.toISOString().split('T')[0],
        expiryDate: expiry.toISOString().split('T')[0],
        dietaryType: item.dietCategory as any,
      });
    }
    setAddedItemNotice(`Added "${item.name}" directly to your Kitchen Inventory!`);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setAddedItemNotice(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search moong sprouts, paneer, chia, chicken, spinach..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Zero Oil Toggle */}
            <button
              type="button"
              onClick={() => setFilterZeroOilOnly(!filterZeroOilOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                filterZeroOilOnly
                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700'
                  : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
              }`}
            >
              <DropletOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Without Oil (Zero Oil)</span>
            </button>

            {/* Without Fire Toggle */}
            <button
              type="button"
              onClick={() => setFilterNoFireOnly(!filterNoFireOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                filterNoFireOnly
                  ? 'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-200 dark:border-cyan-700'
                  : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5 line-through text-cyan-600 dark:text-cyan-400" />
              <span>Without Fire (Raw)</span>
            </button>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all cursor-pointer font-medium ${
                selectedCategory === c
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {addedItemNotice && (
        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{addedItemNotice}</span>
        </div>
      )}

      {/* Grid of Food Nutrition Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-400/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                      {item.dietCategory}
                    </span>
                    {item.isZeroOil && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                        Zero Oil
                      </span>
                    )}
                    {item.isNoFire && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300">
                        Raw / No-Fire
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                    {item.name}
                  </h4>
                  <div className="text-[11px] text-slate-400">{item.serving}</div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {item.calories}
                  </div>
                  <div className="text-[10px] text-slate-400">kcal</div>
                </div>
              </div>

              {/* Macro Pills */}
              <div className="grid grid-cols-4 gap-1.5 mt-3 text-center text-xs">
                <div className="p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30">
                  <div className="text-[9px] uppercase font-bold text-indigo-700 dark:text-indigo-400">
                    Protein
                  </div>
                  <div className="font-extrabold text-indigo-900 dark:text-indigo-200">
                    {item.proteinGrams}g
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30">
                  <div className="text-[9px] uppercase font-bold text-amber-700 dark:text-amber-400">
                    Fat
                  </div>
                  <div className="font-extrabold text-amber-900 dark:text-amber-200">
                    {item.fatsGrams}g
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30">
                  <div className="text-[9px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                    Carbs
                  </div>
                  <div className="font-extrabold text-emerald-900 dark:text-emerald-200">
                    {item.carbsGrams}g
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-teal-50/70 dark:bg-teal-950/30">
                  <div className="text-[9px] uppercase font-bold text-teal-700 dark:text-teal-400">
                    Fiber
                  </div>
                  <div className="font-extrabold text-teal-900 dark:text-teal-200">
                    {item.fiberGrams}g
                  </div>
                </div>
              </div>

              {/* Superfood Highlight */}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                {item.superfoodHighlight}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleAddShopping(item)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Shop</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddInventory(item)}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Pantry</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
