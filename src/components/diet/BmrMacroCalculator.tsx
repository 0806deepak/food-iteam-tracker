import React, { useState, useEffect } from 'react';
import {
  BmrCalculationState,
  BmrCalculationResult,
  BmrFormulaVariant,
  Gender,
  ActivityLevel,
  CalorieGoal,
} from '../../types/diet';
import {
  ACTIVITY_MULTIPLIERS,
  GOAL_ADJUSTMENTS,
  INITIAL_BMR_STATE,
  calculateBmrAndMacros,
  loadBmrState,
  saveBmrState,
} from '../../lib/bmrCalculator';
import {
  Calculator,
  Flame,
  Activity,
  CheckCircle2,
  Sparkles,
  Info,
  Scale,
  Zap,
  Target,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Wheat,
  Dna,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface BmrMacroCalculatorProps {
  onTargetsCalculated?: (result: BmrCalculationResult) => void;
  onExplorePlansClick?: () => void;
}

export const BmrMacroCalculator: React.FC<BmrMacroCalculatorProps> = ({
  onTargetsCalculated,
  onExplorePlansClick,
}) => {
  const [state, setState] = useState<BmrCalculationState>(() => loadBmrState());
  const [result, setResult] = useState<BmrCalculationResult>(() =>
    calculateBmrAndMacros(state)
  );
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  useEffect(() => {
    const calculated = calculateBmrAndMacros(state);
    setResult(calculated);
    if (onTargetsCalculated) {
      onTargetsCalculated(calculated);
    }
  }, [state]);

  const handleSaveProfile = () => {
    saveBmrState(state);
    setIsSavedSuccess(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => setIsSavedSuccess(false), 3000);
  };

  const handleLoadNoteExample = () => {
    const noteState: BmrCalculationState = {
      gender: 'female',
      weightKg: 65,
      heightCm: 163,
      ageYears: 28,
      formula: 'handwritten_female',
      activityLevel: 'moderate',
      goal: 'fat_loss_moderate', // -300 kcal: 1851 - 300 = 1551
      customDeficitKcal: -300,
      proteinMultiplier: 1.5, // 65 * 1.5 = 97.5g
      fatMultiplier: 0.8, // 65 * 0.8 = 52g
    };
    setState(noteState);
    saveBmrState(noteState);
    confetti({
      particleCount: 40,
      spread: 70,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Highlight Card with Handwritten Notes Reference */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Calculator className="w-3.5 h-3.5 text-indigo-400" />
              <span>Scientific Energy Expenditure & Macro Engine</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              BMR, Target Calories & Macro Nutrition Calculator
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Calculates your personal Basal Metabolic Rate using the verified{' '}
              <span className="text-indigo-200 font-semibold">
                Female [655 + (9.6×W) + (1.7×H) - (4.7×A)]
              </span>{' '}
              formula, adjusts for activity expenditure (TDEE), applies a moderate
              deficit (-300 kcal), and computes exact target protein (1.5g/kg), fat (0.8g/kg),
              and clean fiber-rich carbs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
            <button
              onClick={handleLoadNoteExample}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Load Note Example (1551 kcal)</span>
            </button>
            <button
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium border border-white/10 transition-all cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-indigo-300" />
              <span>{showFormulaDetails ? 'Hide' : 'Show'} Formula Proof</span>
            </button>
          </div>
        </div>

        {/* Expandable Handwritten Formula Breakdown Box */}
        <AnimatePresence>
          {showFormulaDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-white/10 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-indigo-400/20 space-y-2">
                  <div className="text-indigo-300 font-bold flex items-center gap-1.5">
                    <Dna className="w-3.5 h-3.5" />
                    <span>Top Section (BMR & Calorie Target)</span>
                  </div>
                  <p className="text-slate-300">
                    Female BMR = 655 + (9.6 × {state.weightKg}) + (1.7 × {state.heightCm}) - (4.7 × {state.ageYears})
                  </p>
                  <p className="text-emerald-400 font-semibold">
                    = {result.bmr} kcal BMR (Base metabolic requirement)
                  </p>
                  <p className="text-slate-300">
                    TDEE with activity ({ACTIVITY_MULTIPLIERS[state.activityLevel].multiplier}×) = {result.tdee} kcal
                  </p>
                  <p className="text-amber-300 font-bold">
                    Target Daily Intake: {result.tdee} - 300 = {result.targetCalories} kcal
                  </p>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-2xl border border-indigo-400/20 space-y-2">
                  <div className="text-teal-300 font-bold flex items-center gap-1.5">
                    <Wheat className="w-3.5 h-3.5" />
                    <span>Bottom Section (Macronutrient Breakdown)</span>
                  </div>
                  <p className="text-slate-300">
                    • Protein: {state.weightKg} × {state.proteinMultiplier} ={' '}
                    <span className="text-white font-bold">{result.proteinGrams}g</span> → {result.proteinGrams} × 4 ={' '}
                    <span className="text-indigo-300">{result.proteinCalories} kcal</span>
                  </p>
                  <p className="text-slate-300">
                    • Fat: {state.weightKg} × {state.fatMultiplier} ={' '}
                    <span className="text-white font-bold">{result.fatGrams}g</span> → {result.fatGrams} × 9 ={' '}
                    <span className="text-amber-300">{result.fatCalories} kcal</span>
                  </p>
                  <p className="text-slate-300">
                    • Carbs: {result.targetCalories} - ({result.proteinCalories} + {result.fatCalories}) ={' '}
                    <span className="text-emerald-300 font-bold">{result.carbsCalories} kcal</span> / 4 ≈{' '}
                    <span className="text-white font-bold">{result.carbsGrams}g</span>
                  </p>
                  <p className="text-teal-300 font-medium">
                    • Fiber Goal: {result.fiberGramsTarget}g / day (Essential for gut microbiome & metabolic health)
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Grid: Inputs on Left, Output Targets on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Biometric Parameters</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Step 1 of 2</span>
          </div>

          {/* Gender & Formula Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Biological Sex
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setState((s) => ({ ...s, gender: 'female' }))}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    state.gender === 'female'
                      ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}
                >
                  Female (Note Formula)
                </button>
                <button
                  type="button"
                  onClick={() => setState((s) => ({ ...s, gender: 'male' }))}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    state.gender === 'male'
                      ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}
                >
                  Male
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Formula Variant
              </label>
              <select
                value={state.formula}
                onChange={(e) =>
                  setState((s) => ({ ...s, formula: e.target.value as BmrFormulaVariant }))
                }
                className="w-full py-2 px-3 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-indigo-500"
              >
                <option value="handwritten_female">Handwritten Note Formula (655+9.6W+1.7H-4.7A)</option>
                <option value="harris_benedict">Standard Harris-Benedict (1984 Revised)</option>
                <option value="mifflin_st_jeor">Mifflin-St Jeor Clinical Equation</option>
              </select>
            </div>
          </div>

          {/* Biometrics Sliders & Inputs (Weight, Height, Age) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Weight */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Weight</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {state.weightKg} kg
                </span>
              </div>
              <input
                type="range"
                min="35"
                max="150"
                step="0.5"
                value={state.weightKg}
                onChange={(e) =>
                  setState((s) => ({ ...s, weightKg: parseFloat(e.target.value) || 65 }))
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>35 kg</span>
                <span>Note: 65 kg</span>
                <span>150 kg</span>
              </div>
            </div>

            {/* Height */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Height</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {state.heightCm} cm
                </span>
              </div>
              <input
                type="range"
                min="120"
                max="215"
                step="1"
                value={state.heightCm}
                onChange={(e) =>
                  setState((s) => ({ ...s, heightCm: parseInt(e.target.value) || 163 }))
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>120 cm</span>
                <span>Note: 163 cm</span>
                <span>215 cm</span>
              </div>
            </div>

            {/* Age */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Age</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {state.ageYears} yrs
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                step="1"
                value={state.ageYears}
                onChange={(e) =>
                  setState((s) => ({ ...s, ageYears: parseInt(e.target.value) || 28 }))
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>15 yrs</span>
                <span>Note: 28 yrs</span>
                <span>90 yrs</span>
              </div>
            </div>
          </div>

          {/* Activity Level Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Activity Level (TDEE Energy Multiplier)</span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                {ACTIVITY_MULTIPLIERS[state.activityLevel].multiplier}× Multiplier
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(ACTIVITY_MULTIPLIERS) as ActivityLevel[]).map((level) => {
                const item = ACTIVITY_MULTIPLIERS[level];
                const isSelected = state.activityLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setState((s) => ({ ...s, activityLevel: level }))}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-900 dark:bg-indigo-950/40 dark:border-indigo-600 dark:text-indigo-200 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {item.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caloric Goal Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Goal & Calorie Deficit / Surplus
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(['fat_loss_moderate', 'maintain', 'muscle_gain'] as CalorieGoal[]).map((g) => {
                const item = GOAL_ADJUSTMENTS[g];
                const isSelected = state.goal === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setState((s) => ({ ...s, goal: g }))}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-600 dark:text-emerald-200 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {g === 'fat_loss_moderate'
                        ? 'Handwritten note: -300 kcal'
                        : item.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Macronutrient Custom Multipliers from Notes */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/60 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-950 dark:text-indigo-200">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Macro Ratio Multipliers (g/kg Bodyweight)</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  setState((s) => ({ ...s, proteinMultiplier: 1.5, fatMultiplier: 0.8 }))
                }
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Reset to Note (1.5 / 0.8)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 dark:text-slate-300">
                    Protein Factor: <strong>{state.proteinMultiplier} g/kg</strong>
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    {result.proteinGrams}g Total
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.4"
                  step="0.1"
                  value={state.proteinMultiplier}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      proteinMultiplier: parseFloat(e.target.value) || 1.5,
                    }))
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Handwritten note: 65 × 1.5 = 97.5g (390 kcal)
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 dark:text-slate-300">
                    Fat Factor: <strong>{state.fatMultiplier} g/kg</strong>
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">
                    {result.fatGrams}g Total
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.4"
                  step="0.05"
                  value={state.fatMultiplier}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      fatMultiplier: parseFloat(e.target.value) || 0.8,
                    }))
                  }
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Handwritten note: 65 × 0.8 = 52g (468 kcal)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Output Column: Results & Macro Distribution (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Calorie Target Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Target Daily Intake
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">
                    {result.targetCalories}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">kcal/day</span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <Flame className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {result.calorieAdjustment <= 0
                    ? `${result.calorieAdjustment} kcal deficit`
                    : `+${result.calorieAdjustment} kcal surplus`}
                </span>
                <div className="text-[11px] text-slate-400 mt-1">
                  BMR: {result.bmr} kcal | TDEE: {result.tdee} kcal
                </div>
              </div>
            </div>

            {/* Macro Ratio Stack Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Macronutrient Energy Balance</span>
                <span className="text-slate-500">
                  {result.proteinPercent}% P / {result.fatPercent}% F / {result.carbsPercent}% C
                </span>
              </div>
              <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800">
                <div
                  style={{ width: `${result.proteinPercent}%` }}
                  className="bg-indigo-600 transition-all duration-300"
                  title={`Protein: ${result.proteinPercent}%`}
                />
                <div
                  style={{ width: `${result.fatPercent}%` }}
                  className="bg-amber-500 transition-all duration-300"
                  title={`Fat: ${result.fatPercent}%`}
                />
                <div
                  style={{ width: `${result.carbsPercent}%` }}
                  className="bg-emerald-500 transition-all duration-300"
                  title={`Carbs: ${result.carbsPercent}%`}
                />
              </div>
            </div>

            {/* 3 Macro Cards */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {/* Protein */}
              <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-900/40 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                  Protein
                </div>
                <div className="text-xl font-black text-indigo-950 dark:text-white mt-0.5">
                  {result.proteinGrams}g
                </div>
                <div className="text-[10px] text-indigo-600/80 dark:text-indigo-300">
                  {result.proteinCalories} kcal (4/g)
                </div>
              </div>

              {/* Fats */}
              <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Healthy Fats
                </div>
                <div className="text-xl font-black text-amber-950 dark:text-white mt-0.5">
                  {result.fatGrams}g
                </div>
                <div className="text-[10px] text-amber-600/80 dark:text-amber-300">
                  {result.fatCalories} kcal (9/g)
                </div>
              </div>

              {/* Carbs */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Clean Carbs
                </div>
                <div className="text-xl font-black text-emerald-950 dark:text-white mt-0.5">
                  {result.carbsGrams}g
                </div>
                <div className="text-[10px] text-emerald-600/80 dark:text-emerald-300">
                  {result.carbsCalories} kcal (4/g)
                </div>
              </div>
            </div>

            {/* Dietary Fiber Callout (Vital for Without Oil & Raw cooking) */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200/70 dark:border-teal-900/40 text-teal-950 dark:text-teal-200">
              <div className="flex items-center gap-2">
                <Wheat className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <div>
                  <div className="text-xs font-bold">Dietary Fiber Minimum Target</div>
                  <div className="text-[10px] text-teal-700/80 dark:text-teal-300">
                    Satiety, cholesterol binding & blood glucose stabilization
                  </div>
                </div>
              </div>
              <div className="text-lg font-black text-teal-800 dark:text-teal-200">
                {result.fiberGramsTarget}g+
              </div>
            </div>

            {/* Save Profile Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isSavedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Profile Target Saved!</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Save My Daily BMR Target</span>
                  </>
                )}
              </button>

              {onExplorePlansClick && (
                <button
                  type="button"
                  onClick={onExplorePlansClick}
                  className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Diets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
