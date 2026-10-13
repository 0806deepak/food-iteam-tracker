import React from 'react';
import { DietMeal } from '../../types/diet';
import { InventoryItem } from '../../types/inventory';
import {
  X,
  Clock,
  Flame,
  Wheat,
  Sparkles,
  CheckCircle2,
  Plus,
  ShoppingCart,
  Dna,
  ShieldCheck,
  CookingPot,
  Heart,
  DropletOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface RecipeDetailModalProps {
  meal: DietMeal | null;
  onClose: () => void;
  inventoryItems?: InventoryItem[];
  onAddIngredientsToShoppingList?: (ingredients: string[]) => void;
  onLogMeal?: (meal: DietMeal) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  meal,
  onClose,
  inventoryItems = [],
  onAddIngredientsToShoppingList,
  onLogMeal,
}) => {
  if (!meal) return null;

  const handleAddAllToShoppingList = () => {
    if (onAddIngredientsToShoppingList) {
      onAddIngredientsToShoppingList(meal.ingredients.map((i) => i.name));
    }
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  const isZeroOil = meal.cookingMethod === 'Without Oil';
  const isNoFire = meal.cookingMethod === 'Without Fire';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl"
        >
          {/* Top Image Banner */}
          <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-t-3xl bg-slate-950">
            <img
              src={meal.imageUrl}
              alt={meal.title}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-all cursor-pointer backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-6 right-6 text-white space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/80 backdrop-blur-md">
                  {meal.mealType.replace('_', ' ').toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/80 backdrop-blur-md">
                  {meal.dietCategory}
                </span>
                {isZeroOil && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/90 text-amber-950 backdrop-blur-md">
                    <DropletOff className="w-3 h-3" />
                    <span>Without Oil Cooking</span>
                  </span>
                )}
                {isNoFire && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/90 text-cyan-950 backdrop-blur-md">
                    <Flame className="w-3 h-3 line-through" />
                    <span>Without Fire / Raw</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black">{meal.title}</h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Calories</span>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {meal.calories}
                  <span className="text-xs text-slate-400 font-normal"> kcal</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-500">Protein</span>
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {meal.proteinGrams}g
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-500">Fats</span>
                <div className="text-xl font-black text-amber-600 dark:text-amber-400">
                  {meal.fatsGrams}g
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-500">Carbs</span>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {meal.carbsGrams}g
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase text-teal-500">Fiber</span>
                <div className="text-xl font-black text-teal-600 dark:text-teal-400">
                  {meal.fiberGrams}g
                </div>
              </div>
            </div>

            {/* Why it works / Health Mechanism */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/60 space-y-1.5">
              <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Nutritional Science & Body Synergy</span>
              </h4>
              <p className="text-xs text-indigo-950/80 dark:text-indigo-200/80 leading-relaxed">
                {meal.whyItWorks}
              </p>
              {meal.micronutrients.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {meal.micronutrients.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Ingredients Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CookingPot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Exact Ingredients & Portion Nutrition</span>
                </h4>
                <button
                  type="button"
                  onClick={handleAddAllToShoppingList}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Shopping List</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3">Ingredient Item</th>
                      <th className="p-3">Portion</th>
                      <th className="p-3 text-right">Calories</th>
                      <th className="p-3 text-right">Protein</th>
                      <th className="p-3 text-right">Carbs</th>
                      <th className="p-3 text-right">Fats</th>
                      <th className="p-3 text-right">Fiber</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {meal.ingredients.map((ing, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          {ing.name}
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">{ing.amount}</td>
                        <td className="p-3 text-right font-medium">{ing.calories} kcal</td>
                        <td className="p-3 text-right font-bold text-indigo-600 dark:text-indigo-400">
                          {ing.proteinGrams}g
                        </td>
                        <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">
                          {ing.carbsGrams}g
                        </td>
                        <td className="p-3 text-right text-amber-600 dark:text-amber-400">
                          {ing.fatsGrams}g
                        </td>
                        <td className="p-3 text-right text-teal-600 dark:text-teal-400 font-medium">
                          {ing.fiberGrams}g
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Preparation Steps */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>
                  {isNoFire
                    ? 'No-Fire Live Preparation Steps'
                    : isZeroOil
                    ? 'Zero-Oil Cooking & Steaming Instructions'
                    : 'Culinary Instructions'}
                </span>
              </h4>
              <div className="space-y-2.5">
                {meal.instructions.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Close
              </button>

              {onLogMeal && (
                <button
                  type="button"
                  onClick={() => {
                    onLogMeal(meal);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Log to Today's Food Tracker</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
