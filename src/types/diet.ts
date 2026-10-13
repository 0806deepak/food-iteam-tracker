export type Gender = 'female' | 'male';

export type BmrFormulaVariant = 'handwritten_female' | 'harris_benedict' | 'mifflin_st_jeor';

export type ActivityLevel =
  | 'sedentary' // 1.2
  | 'light' // 1.375
  | 'moderate' // 1.55 (or 1.325 in custom)
  | 'very_active' // 1.725
  | 'extra_active'; // 1.9

export type CalorieGoal =
  | 'fat_loss_moderate' // -300 kcal (as in handwritten note: 1851 - 300 = 1551)
  | 'fat_loss_aggressive' // -500 kcal
  | 'maintain' // 0 kcal
  | 'muscle_gain' // +250 kcal
  | 'lean_bulk' // +400 kcal
  | 'custom';

export type DietCategory = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan';

export type CookingMethodType =
  | 'Without Oil' // Zero oil, steamed, air-crisped, water sauté
  | 'Without Fire' // Raw, sprouted, blended, no heat applied
  | 'Minimal Oil' // < 1 tsp cold pressed
  | 'Steamed';

export interface BmrCalculationState {
  gender: Gender;
  weightKg: number;
  heightCm: number;
  ageYears: number;
  formula: BmrFormulaVariant;
  activityLevel: ActivityLevel;
  goal: CalorieGoal;
  customDeficitKcal: number;
  proteinMultiplier: number; // e.g. 1.5 g/kg (handwritten: 65 * 1.5 = 97.5g)
  fatMultiplier: number; // e.g. 0.8 g/kg (handwritten: 65 * 0.8 = 52g)
}

export interface BmrCalculationResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  calorieAdjustment: number;
  proteinGrams: number;
  proteinCalories: number;
  fatGrams: number;
  fatCalories: number;
  carbsGrams: number;
  carbsCalories: number;
  fiberGramsTarget: number;
  proteinPercent: number;
  fatPercent: number;
  carbsPercent: number;
  formulaExplanation: string;
}

export interface MealIngredient {
  name: string;
  amount: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams: number;
}

export interface DietMeal {
  id: string;
  title: string;
  mealType: 'breakfast' | 'mid_morning' | 'lunch' | 'evening_snack' | 'dinner';
  dietCategory: DietCategory;
  cookingMethod: CookingMethodType;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: MealIngredient[];
  instructions: string[];
  whyItWorks: string;
  micronutrients: string[];
  tags: string[];
  imageUrl: string;
}

export interface DailyDietPlan {
  id: string;
  title: string;
  subtitle: string;
  dietCategory: DietCategory;
  cookingMethod: CookingMethodType | 'Hybrid Clean';
  targetGoal: string;
  totalCalories: number;
  totalProteinGrams: number;
  totalCarbsGrams: number;
  totalFatsGrams: number;
  totalFiberGrams: number;
  meals: DietMeal[];
  healthBenefits: string[];
  chefTip: string;
  badge: string;
}

export interface FoodNutritionItem {
  id: string;
  name: string;
  category: 'Sprouts & Pulses' | 'Vegetables & Greens' | 'Fruits' | 'Nuts & Seeds' | 'Dairy & Plant Milk' | 'Lean Meats & Seafood' | 'Grains';
  serving: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams: number;
  dietCategory: DietCategory;
  isZeroOil: boolean;
  isNoFire: boolean;
  superfoodHighlight: string;
}
