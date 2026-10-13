import React, { useState } from 'react';
import { InventoryItem } from '../../types/inventory';
import {
  BmrCalculationResult,
  DietMeal,
  DailyDietPlan,
  DietCategory,
  CookingMethodType,
} from '../../types/diet';
import { calculateBmrAndMacros, loadBmrState } from '../../lib/bmrCalculator';
import { CURATED_DIET_PLANS } from '../../data/curatedDietPlans';
import { BmrMacroCalculator } from './BmrMacroCalculator';
import { DailyMealPlanner } from './DailyMealPlanner';
import { FoodNutritionInspector } from './FoodNutritionInspector';
import { RecipeDetailModal } from './RecipeDetailModal';
import {
  Calculator,
  Utensils,
  BookOpen,
  Wheat,
  Flame,
  DropletOff,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  ShoppingBag,
  ArrowRight,
  Send,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface DietPlansHubProps {
  inventoryItems: InventoryItem[];
  onAddInventoryItem?: (item: Partial<InventoryItem>) => void;
  onAddShoppingItem?: (item: { name: string; category: string }) => void;
}

export const DietPlansHub: React.FC<DietPlansHubProps> = ({
  inventoryItems,
  onAddInventoryItem,
  onAddShoppingItem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'calculator' | 'plans' | 'builder' | 'database' | 'ai_generator'
  >('calculator');

  const [bmrResult, setBmrResult] = useState<BmrCalculationResult>(() =>
    calculateBmrAndMacros(loadBmrState())
  );

  // Filter state for Plans & Recipes tab
  const [selectedDietCategory, setSelectedDietCategory] = useState<string>('All');
  const [selectedCookingMethod, setSelectedCookingMethod] = useState<string>('All');

  // Selected meal for detail modal
  const [activeModalMeal, setActiveModalMeal] = useState<DietMeal | null>(null);

  // AI Diet Generator State
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [isGeneratingAiPlan, setIsGeneratingAiPlan] = useState(false);
  const [aiPlanResult, setAiPlanResult] = useState<any | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Handle shopping list addition
  const handleAddIngredientsToShopping = (ingredients: string[]) => {
    if (onAddShoppingItem) {
      ingredients.forEach((ing) => {
        onAddShoppingItem({ name: ing, category: 'Fresh Produce' });
      });
    }
  };

  const handleGenerateAiDiet = async () => {
    setIsGeneratingAiPlan(true);
    setAiError(null);
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: inventoryItems.length > 0 ? inventoryItems : [{ productName: 'Sprouted lentils' }],
          dietary: selectedDietCategory !== 'All' ? selectedDietCategory : 'Vegetarian or Vegan',
          cuisine: `Zero Oil Cooking and Raw Without Fire cooking under ${bmrResult.targetCalories} kcal with high protein ${bmrResult.proteinGrams}g`,
          mealType: aiCustomPrompt || 'Complete Balanced Daily Diet Plan',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate customized AI diet plan');
      }

      const data = await response.json();
      setAiPlanResult(data.recipes || []);
      confetti({
        particleCount: 40,
        spread: 70,
      });
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Unable to connect to AI server. Please try again.');
    } finally {
      setIsGeneratingAiPlan(false);
    }
  };

  // Filter recipes from all curated plans
  const allMeals = CURATED_DIET_PLANS.flatMap((p) => p.meals);
  const filteredMeals = allMeals.filter((m) => {
    const matchesDiet =
      selectedDietCategory === 'All' || m.dietCategory === selectedDietCategory;
    const matchesCooking =
      selectedCookingMethod === 'All' || m.cookingMethod === selectedCookingMethod;
    return matchesDiet && matchesCooking;
  });

  return (
    <div className="space-y-6">
      {/* Hero Header with Organic Photography & Quick Metrics */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-emerald-500/30 text-white shadow-2xl">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1600&auto=format&fit=crop&q=80"
            alt="Organic vibrant healthy natural diet"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-emerald-950/40" />
        </div>

        <div className="relative z-10 p-6 md:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scientific Nutritional Engine</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <DropletOff className="w-3 h-3 text-amber-400" />
              <span>Without Oil Cooking</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
              <Flame className="w-3 h-3 line-through text-cyan-400" />
              <span>Without Fire (Raw Living)</span>
            </span>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              BMR Diet & Macronutrient Hub
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Calculate your personal energy expenditure with the handwritten{' '}
              <span className="text-emerald-300 font-semibold">BMR formula</span>, hit your exact{' '}
              <span className="text-indigo-300 font-semibold">
                {bmrResult.targetCalories} kcal & {bmrResult.proteinGrams}g protein
              </span>{' '}
              goals, and discover culinary plans designed for Zero-Oil steaming and No-Fire live nutrition.
            </p>
          </div>

          {/* Quick Target Ribbon */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-slate-400">Target Calories: </span>
              <strong className="text-emerald-300 font-extrabold">
                {bmrResult.targetCalories} kcal
              </strong>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-slate-400">Protein: </span>
              <strong className="text-indigo-300 font-extrabold">{bmrResult.proteinGrams}g</strong>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-slate-400">Fat: </span>
              <strong className="text-amber-300 font-extrabold">{bmrResult.fatGrams}g</strong>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-slate-400">Carbs: </span>
              <strong className="text-emerald-300 font-extrabold">{bmrResult.carbsGrams}g</strong>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-slate-400">Fiber Target: </span>
              <strong className="text-teal-300 font-extrabold">{bmrResult.fiberGramsTarget}g+</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl overflow-x-auto border border-slate-200/80 dark:border-slate-700/80">
        <button
          onClick={() => setActiveSubTab('calculator')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'calculator'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Calculator</span>
        </button>

        <button
          onClick={() => setActiveSubTab('plans')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'plans'
              ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Diet Plans</span>
        </button>

        <button
          onClick={() => setActiveSubTab('builder')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'builder'
              ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Meal Planner</span>
        </button>

        <button
          onClick={() => setActiveSubTab('database')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'database'
              ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Wheat className="w-3.5 h-3.5" />
          <span>Nutrition DB</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ai_generator')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'ai_generator'
              ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Generator</span>
        </button>
      </div>

      {/* Tab 1: BMR & Macro Calculator */}
      {activeSubTab === 'calculator' && (
        <BmrMacroCalculator
          onTargetsCalculated={(res) => setBmrResult(res)}
          onExplorePlansClick={() => setActiveSubTab('plans')}
        />
      )}

      {/* Tab 2: Diet Plans & Recipes */}
      {activeSubTab === 'plans' && (
        <div className="space-y-6">
          {/* Category & Cooking Style Filter Bar */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Diet Categories */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-500 mr-1">Diet:</span>
                {['All', 'Vegetarian', 'Vegan', 'Non-Vegetarian'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedDietCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedDietCategory === cat
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Cooking Styles */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-500 mr-1">Cooking Style:</span>
                {['All', 'Without Oil', 'Without Fire'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectedCookingMethod(method)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedCookingMethod === method
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recipes Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMeals.map((meal) => (
              <div
                key={meal.id}
                className="group rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={meal.imageUrl}
                      alt={meal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md">
                        {meal.mealType.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-xs font-bold bg-emerald-600/90 px-2 py-0.5 rounded-lg">
                        {meal.dietCategory}
                      </span>
                      <span className="text-sm font-extrabold bg-slate-900/80 px-2.5 py-0.5 rounded-lg">
                        {meal.calories} kcal
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {meal.cookingMethod === 'Without Oil' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          Without Oil
                        </span>
                      )}
                      {meal.cookingMethod === 'Without Fire' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                          Without Fire / Raw
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {meal.title}
                    </h4>

                    {/* Quick Macro Bar */}
                    <div className="grid grid-cols-4 gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center text-[10px]">
                      <div>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                          {meal.proteinGrams}g
                        </span>
                        <div className="text-[9px] text-slate-400">Protein</div>
                      </div>
                      <div>
                        <span className="text-amber-600 dark:text-amber-400 font-bold">
                          {meal.fatsGrams}g
                        </span>
                        <div className="text-[9px] text-slate-400">Fat</div>
                      </div>
                      <div>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {meal.carbsGrams}g
                        </span>
                        <div className="text-[9px] text-slate-400">Carbs</div>
                      </div>
                      <div>
                        <span className="text-teal-600 dark:text-teal-400 font-bold">
                          {meal.fiberGrams}g
                        </span>
                        <div className="text-[9px] text-slate-400">Fiber</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {meal.whyItWorks}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => setActiveModalMeal(meal)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>View Ingredients & Recipe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Daily Meal Planner */}
      {activeSubTab === 'builder' && (
        <DailyMealPlanner
          bmrResult={bmrResult}
          onOpenMealDetail={(meal) => setActiveModalMeal(meal)}
        />
      )}

      {/* Tab 4: Food & Fiber Database */}
      {activeSubTab === 'database' && (
        <FoodNutritionInspector
          onAddIngredientToInventory={onAddInventoryItem}
          onAddIngredientToShoppingList={(name, cat) => {
            if (onAddShoppingItem) onAddShoppingItem({ name, category: cat });
          }}
        />
      )}

      {/* Tab 5: AI Custom Diet Generator */}
      {activeSubTab === 'ai_generator' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Gemini AI Tailored Diet Generator
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Describe your exact dietary goals or restrictions. AI will formulate a
              customized diet matching your target {bmrResult.targetCalories} kcal and{' '}
              {bmrResult.proteinGrams}g protein with Zero-Oil and Without-Fire culinary methods.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g. 100% Zero-oil Indian vegetarian diet rich in sprouts and paneer under 1550 kcal"
                value={aiCustomPrompt}
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-purple-500"
              />
              <button
                type="button"
                onClick={handleGenerateAiDiet}
                disabled={isGeneratingAiPlan}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAiPlan ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Calculating Diet...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Diet Plan</span>
                  </>
                )}
              </button>
            </div>

            {aiError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 text-xs">
                {aiError}
              </div>
            )}
          </div>

          {/* Generated AI Recipes */}
          {aiPlanResult && Array.isArray(aiPlanResult) && aiPlanResult.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiPlanResult.map((recipe: any, idx: number) => (
                <div
                  key={recipe.id || idx}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {recipe.title}
                    </h4>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      {recipe.nutritionPerServing?.calories || 400} kcal
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-3">{recipe.description}</p>
                  <div className="text-[10px] text-slate-400">
                    P: {recipe.nutritionPerServing?.proteinGrams}g | C:{' '}
                    {recipe.nutritionPerServing?.carbsGrams}g | F:{' '}
                    {recipe.nutritionPerServing?.fatsGrams}g
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        meal={activeModalMeal}
        onClose={() => setActiveModalMeal(null)}
        inventoryItems={inventoryItems}
        onAddIngredientsToShoppingList={handleAddIngredientsToShopping}
        onLogMeal={(meal) => {
          confetti({ particleCount: 30, spread: 60 });
        }}
      />
    </div>
  );
};
