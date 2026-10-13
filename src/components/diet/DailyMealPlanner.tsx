import React, { useState } from 'react';
import { DailyDietPlan, DietMeal, BmrCalculationResult } from '../../types/diet';
import { CURATED_DIET_PLANS } from '../../data/curatedDietPlans';
import {
  Flame,
  Wheat,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  DropletOff,
  ChefHat,
  RotateCcw,
  Check,
  Plus,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface DailyMealPlannerProps {
  bmrResult: BmrCalculationResult;
  onOpenMealDetail: (meal: DietMeal) => void;
}

export const DailyMealPlanner: React.FC<DailyMealPlannerProps> = ({
  bmrResult,
  onOpenMealDetail,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-zero-oil-veg');
  const [checkedMealIds, setCheckedMealIds] = useState<Record<string, boolean>>({
    'zo-m1': true,
    'zo-m2': true,
    'zo-m3': true,
    'zo-m4': true,
    'zo-m5': true,
  });

  const activePlan =
    CURATED_DIET_PLANS.find((p) => p.id === selectedPlanId) || CURATED_DIET_PLANS[0];

  const handlePlanSelect = (plan: DailyDietPlan) => {
    setSelectedPlanId(plan.id);
    const initialChecked: Record<string, boolean> = {};
    plan.meals.forEach((m) => {
      initialChecked[m.id] = true;
    });
    setCheckedMealIds(initialChecked);
    confetti({
      particleCount: 25,
      spread: 60,
    });
  };

  const toggleMealCheck = (mealId: string) => {
    setCheckedMealIds((prev) => ({
      ...prev,
      [mealId]: !prev[mealId],
    }));
  };

  // Compute selected totals
  const selectedMeals = activePlan.meals.filter((m) => checkedMealIds[m.id]);
  const currentTotalCalories = selectedMeals.reduce((acc, m) => acc + m.calories, 0);
  const currentTotalProtein = selectedMeals.reduce((acc, m) => acc + m.proteinGrams, 0);
  const currentTotalCarbs = selectedMeals.reduce((acc, m) => acc + m.carbsGrams, 0);
  const currentTotalFats = selectedMeals.reduce((acc, m) => acc + m.fatsGrams, 0);
  const currentTotalFiber = selectedMeals.reduce((acc, m) => acc + m.fiberGrams, 0);

  // Compare to BMR targets
  const targetCalories = bmrResult.targetCalories;
  const targetProtein = bmrResult.proteinGrams;
  const targetCarbs = bmrResult.carbsGrams;
  const targetFats = bmrResult.fatGrams;
  const targetFiber = bmrResult.fiberGramsTarget;

  const calProgress = Math.min(100, Math.round((currentTotalCalories / targetCalories) * 100));
  const proteinProgress = Math.min(100, Math.round((currentTotalProtein / targetProtein) * 100));
  const carbsProgress = Math.min(100, Math.round((currentTotalCarbs / targetCarbs) * 100));
  const fatsProgress = Math.min(100, Math.round((currentTotalFats / targetFats) * 100));
  const fiberProgress = Math.min(100, Math.round((currentTotalFiber / targetFiber) * 100));

  return (
    <div className="space-y-6">
      {/* Preset Plan Switcher */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ChefHat className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Select Structured Daily Protocol</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {CURATED_DIET_PLANS.length} Specialized Plans Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CURATED_DIET_PLANS.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => handlePlanSelect(plan)}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-400 dark:bg-indigo-950/40 dark:border-indigo-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 dark:bg-slate-800/60 dark:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {plan.badge}
                    </span>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                      {plan.totalCalories} kcal
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {plan.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {plan.subtitle}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  <span>{plan.dietCategory}</span>
                  <span>{plan.meals.length} Scheduled Meals</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Target Comparison Meter */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Live Plan vs. Personal BMR Targets</span>
            </div>
            <h3 className="text-xl font-black mt-0.5">
              {currentTotalCalories} / {targetCalories} kcal Selected
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold border border-white/10">
              {calProgress}% Energy Match
            </div>
          </div>
        </div>

        {/* 5 Macro Progress Trackers */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
          {/* Calories */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Calories</span>
              <span className="font-bold">{calProgress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                style={{ width: `${calProgress}%` }}
                className="h-full bg-amber-400 transition-all duration-300"
              />
            </div>
            <div className="text-[10px] text-slate-400 text-right">
              {currentTotalCalories} / {targetCalories} kcal
            </div>
          </div>

          {/* Protein */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-indigo-300">Protein</span>
              <span className="font-bold text-indigo-300">{proteinProgress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                style={{ width: `${proteinProgress}%` }}
                className="h-full bg-indigo-500 transition-all duration-300"
              />
            </div>
            <div className="text-[10px] text-indigo-300/80 text-right">
              {Math.round(currentTotalProtein)}g / {targetProtein}g
            </div>
          </div>

          {/* Fats */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-amber-300">Fats</span>
              <span className="font-bold text-amber-300">{fatsProgress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                style={{ width: `${fatsProgress}%` }}
                className="h-full bg-amber-500 transition-all duration-300"
              />
            </div>
            <div className="text-[10px] text-amber-300/80 text-right">
              {Math.round(currentTotalFats)}g / {targetFats}g
            </div>
          </div>

          {/* Carbs */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-emerald-300">Carbs</span>
              <span className="font-bold text-emerald-300">{carbsProgress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                style={{ width: `${carbsProgress}%` }}
                className="h-full bg-emerald-500 transition-all duration-300"
              />
            </div>
            <div className="text-[10px] text-emerald-300/80 text-right">
              {Math.round(currentTotalCarbs)}g / {targetCarbs}g
            </div>
          </div>

          {/* Fiber */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-teal-300">Fiber</span>
              <span className="font-bold text-teal-300">{fiberProgress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                style={{ width: `${fiberProgress}%` }}
                className="h-full bg-teal-400 transition-all duration-300"
              />
            </div>
            <div className="text-[10px] text-teal-300/80 text-right">
              {Math.round(currentTotalFiber)}g / {targetFiber}g
            </div>
          </div>
        </div>
      </div>

      {/* Meals Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Scheduled Daily Meals ({activePlan.meals.length})
          </h4>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click recipe to view complete zero-oil / no-fire cooking directions
          </span>
        </div>

        <div className="space-y-3">
          {activePlan.meals.map((meal, idx) => {
            const isChecked = !!checkedMealIds[meal.id];
            return (
              <div
                key={meal.id}
                className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isChecked
                    ? 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs'
                    : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => toggleMealCheck(meal.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-indigo-600 text-white'
                        : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isChecked && <Check className="w-4 h-4" />}
                  </button>

                  <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-950">
                    <img
                      src={meal.imageUrl}
                      alt={meal.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {meal.mealType.replace('_', ' ')}
                      </span>
                      {meal.cookingMethod === 'Without Oil' && (
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                          Zero Oil
                        </span>
                      )}
                      {meal.cookingMethod === 'Without Fire' && (
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300">
                          No Fire (Raw)
                        </span>
                      )}
                    </div>
                    <h5
                      onClick={() => onOpenMealDetail(meal)}
                      className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors mt-0.5 line-clamp-1"
                    >
                      {meal.title}
                    </h5>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{meal.ingredients.length} ingredients</span>
                      <span>•</span>
                      <span>{meal.cookTimeMinutes === 0 ? 'No cooking (Raw)' : `${meal.cookTimeMinutes} min cook`}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {meal.calories} kcal
                    </div>
                    <div className="text-[10px] text-slate-400">
                      P: {meal.proteinGrams}g | F: {meal.fatsGrams}g | C: {meal.carbsGrams}g | Fib: {meal.fiberGrams}g
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenMealDetail(meal)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                    title="View Full Recipe & Instructions"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
