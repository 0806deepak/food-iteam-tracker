import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Droplets,
  HeartPulse,
  Plus,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Calendar,
} from 'lucide-react';
import { calculateBmrAndMacros, loadBmrState } from '../../lib/bmrCalculator';

interface DailyMacroGlanceWidgetProps {
  onNavigateToDiet: () => void;
  onNavigateToRecipes: () => void;
  onOpenScanner?: () => void;
}

export const DailyMacroGlanceWidget: React.FC<DailyMacroGlanceWidgetProps> = ({
  onNavigateToDiet,
  onNavigateToRecipes,
  onOpenScanner,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0); // 0 = Today, -1 = Yesterday, 1 = Tomorrow
  const calculation = calculateBmrAndMacros(loadBmrState());

  const {
    targetCalories,
    bmr,
    tdee,
    proteinGrams,
    proteinCalories,
    fatGrams,
    fatCalories,
    carbsGrams,
    carbsCalories,
    proteinPercent,
    fatPercent,
    carbsPercent,
    fiberGramsTarget,
  } = calculation;

  // Calorie Equation (MyFitnessPal Replica)
  // Remaining = Goal - Food + Exercise
  const foodLoggedCalories = 420;
  const exerciseCalories = 0;
  const remainingCalories = Math.max(0, targetCalories - foodLoggedCalories + exerciseCalories);
  const progressPercent = Math.min(100, Math.round((foodLoggedCalories / targetCalories) * 100));

  // Circular ring calculations (r = 44, circumference = 2 * PI * 44 ≈ 276.46)
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Sample Meal Diary Entries (MyFitnessPal Replica)
  const meals = [
    {
      id: 'breakfast',
      name: 'Breakfast',
      icon: Coffee,
      calories: 280,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      items: ['Rolled Oats & Chia Seed Pudding', 'Almond Milk'],
    },
    {
      id: 'lunch',
      name: 'Lunch',
      icon: Sun,
      calories: 140,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      items: ['Garden Salad Bowl with Avocado'],
    },
    {
      id: 'dinner',
      name: 'Dinner',
      icon: Moon,
      calories: 0,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      items: [],
    },
    {
      id: 'snacks',
      name: 'Snacks & Hydration',
      icon: Cookie,
      calories: 0,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      items: [],
    },
  ];

  const getDateLabel = () => {
    if (selectedDayOffset === 0) return 'Today';
    if (selectedDayOffset === -1) return 'Yesterday';
    if (selectedDayOffset === 1) return 'Tomorrow';
    return 'Selected Day';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-sky-500/10 dark:bg-sky-500/15 blur-3xl pointer-events-none" />

      {/* Top Header Bar: Date & MyFitnessPal Style Navigation */}
      <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {getDateLabel()} • Nutrition & Calorie Diary
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold hidden sm:inline-block">
            Auto-Sync Active
          </span>
        </div>

        {/* Date stepper */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setSelectedDayOffset(-1)}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              selectedDayOffset === -1
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Yday
          </button>
          <button
            onClick={() => setSelectedDayOffset(0)}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              selectedDayOffset === 0
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSelectedDayOffset(1)}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              selectedDayOffset === 1
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tmrw
          </button>
        </div>
      </div>

      {/* Main Body: MyFitnessPal Signature Calorie Ring & Equation */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Big Calorie Equation & Circular Ring (MyFitnessPal Replica) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 bg-gradient-to-br from-slate-50 to-slate-100/70 dark:from-slate-800/60 dark:to-slate-800/30 p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            {/* Circular Ring SVG */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring Track */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-200 dark:text-slate-700/80 fill-transparent"
                />
                {/* Progress Ring Stroke */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="url(#calorieGradient)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="fill-transparent transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inside Ring Numbers */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {remainingCalories.toLocaleString()}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 -mt-0.5">
                  Remaining
                </span>
              </div>
            </div>

            {/* Calorie Equation: Goal - Food + Exercise = Remaining */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Calories Equation
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-center bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    {targetCalories}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Goal</div>
                </div>
                <div className="text-slate-300 dark:text-slate-600 font-bold self-center">-</div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {foodLoggedCalories}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Food</div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-sky-600 dark:text-sky-400">
                    {remainingCalories}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Left</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Burned: {bmr} BMR + 300 Activity</span>
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {progressPercent}% consumed
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Macronutrient Split Progress Bars (MyFitnessPal Style) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Macronutrient Targets
              </h4>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <span>{isExpanded ? 'Hide Diary' : 'View Diary'}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Protein Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5 font-bold text-sky-600 dark:text-sky-400">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Protein
                </span>
                <span className="text-slate-600 dark:text-slate-300 font-semibold">
                  32g / {proteinGrams}g ({proteinPercent}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((32 / proteinGrams) * 100))}%` }}
                />
              </div>
            </div>

            {/* Fat Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Fat
                </span>
                <span className="text-slate-600 dark:text-slate-300 font-semibold">
                  14g / {fatGrams}g ({fatPercent}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((14 / fatGrams) * 100))}%` }}
                />
              </div>
            </div>

            {/* Carbs Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Carbohydrates
                </span>
                <span className="text-slate-600 dark:text-slate-300 font-semibold">
                  48g / {carbsGrams}g ({carbsPercent}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((48 / carbsGrams) * 100))}%` }}
                />
              </div>
            </div>

            {/* Fiber Target */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-teal-500" />
                <span>Daily Fiber Target:</span>
              </span>
              <span className="font-bold text-teal-600 dark:text-teal-400">
                {fiberGramsTarget}g / day
              </span>
            </div>
          </div>
        </div>

        {/* --- Collapsible Food Stories & MyFitnessPal Meal Diary --- */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28 }}
              className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Daily Meals Breakdown
                  </h4>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Total Logged: <strong className="text-slate-900 dark:text-white font-bold">{foodLoggedCalories} kcal</strong>
                </div>
              </div>

              {/* Meal Slots (Breakfast, Lunch, Dinner, Snacks) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {meals.map((meal) => {
                  const MealIcon = meal.icon;

                  return (
                    <div
                      key={meal.id}
                      className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-xl ${meal.bgColor} ${meal.color} flex items-center justify-center`}>
                            <MealIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-slate-900 dark:text-white block">
                              {meal.name}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              {meal.calories > 0 ? `${meal.calories} kcal` : 'No food logged yet'}
                            </span>
                          </div>
                        </div>

                        {/* + Add Food Action */}
                        <button
                          onClick={onOpenScanner}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-600 text-[11px] font-bold shadow-2xs transition-all active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Food</span>
                        </button>
                      </div>

                      {/* Logged Item list */}
                      {meal.items.length > 0 ? (
                        <div className="space-y-1 pl-2 border-l-2 border-emerald-400/60 text-xs text-slate-600 dark:text-slate-300">
                          {meal.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[11px]">
                              <span>{item}</span>
                              <span className="text-slate-400 font-mono">logged</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">
                          Tap 'Add Food' or use the scanner button to log from your inventory.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Navigation Footer */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={onNavigateToDiet}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <span>Diet Plans & Macro Calculator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onNavigateToRecipes}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <span>Zero-Waste Recipe Generator</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 font-medium">
                  Harris-Benedict BMR: {bmr} kcal • TDEE: {tdee} kcal
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
