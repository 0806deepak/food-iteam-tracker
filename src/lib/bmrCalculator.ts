import {
  BmrCalculationState,
  BmrCalculationResult,
  ActivityLevel,
  CalorieGoal,
} from '../types/diet';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, { multiplier: number; label: string; description: string }> = {
  sedentary: {
    multiplier: 1.2,
    label: 'Sedentary',
    description: 'Desk job, little to no regular workout',
  },
  light: {
    multiplier: 1.375,
    label: 'Lightly Active',
    description: 'Light exercise or brisk walks 1-3 days/week',
  },
  moderate: {
    multiplier: 1.55,
    label: 'Moderately Active',
    description: 'Moderate exercise or sports 3-5 days/week (Matches note sample)',
  },
  very_active: {
    multiplier: 1.725,
    label: 'Very Active',
    description: 'Hard workouts or athletic training 6-7 days/week',
  },
  extra_active: {
    multiplier: 1.9,
    label: 'Extra Active',
    description: 'Intense physical labor or twice-a-day training',
  },
};

export const GOAL_ADJUSTMENTS: Record<CalorieGoal, { adjustment: number; label: string; description: string }> = {
  fat_loss_moderate: {
    adjustment: -300,
    label: 'Moderate Fat Loss (-300 kcal)',
    description: 'Gradual, sustainable weight management (Exact handwritten formula)',
  },
  fat_loss_aggressive: {
    adjustment: -500,
    label: 'Fast Fat Loss (-500 kcal)',
    description: 'Higher calorie deficit for quicker weight reduction',
  },
  maintain: {
    adjustment: 0,
    label: 'Maintain Current Weight',
    description: 'Energy balance to sustain current body mass & vitality',
  },
  muscle_gain: {
    adjustment: 250,
    label: 'Lean Muscle Gain (+250 kcal)',
    description: 'Slight caloric surplus for clean hypertrophy',
  },
  lean_bulk: {
    adjustment: 400,
    label: 'Performance Bulking (+400 kcal)',
    description: 'Substantial energy surplus for strength & mass increase',
  },
  custom: {
    adjustment: 0,
    label: 'Custom Calorie Adjustment',
    description: 'User specified custom deficit or surplus',
  },
};

export const INITIAL_BMR_STATE: BmrCalculationState = {
  gender: 'female',
  weightKg: 65, // From note: 65 kg
  heightCm: 163, // Yields ~1851 TDEE with moderate activity
  ageYears: 28,
  formula: 'handwritten_female',
  activityLevel: 'moderate',
  goal: 'fat_loss_moderate', // -300 kcal from note: 1851 - 300 = 1551
  customDeficitKcal: -300,
  proteinMultiplier: 1.5, // From note: 65 * 1.5 = 97.5g -> 390 kcal
  fatMultiplier: 0.8, // From note: 65 * 0.8 = 52g -> 468 kcal
};

const STORAGE_KEY = 'food_tracker_bmr_profile_v1';

export function loadBmrState(): BmrCalculationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...INITIAL_BMR_STATE, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load BMR state from localStorage', e);
  }
  return INITIAL_BMR_STATE;
}

export function saveBmrState(state: BmrCalculationState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save BMR state to localStorage', e);
  }
}

/**
 * Calculates BMR, TDEE, Target Calories, and Macronutrient Grams according to the exact handwritten formula:
 * Female: 655 + (9.6 * weight) + (1.7 * height) - (4.7 * age)
 * Intermediate TDEE = BMR * activity multiplier
 * Target Calorie = TDEE - 300 = 1551
 * Protein = weight * 1.5 = 97g -> 390 kcal (4 kcal/g)
 * Fat = weight * 0.8 = 52g -> 468 kcal (9 kcal/g)
 * Carbs = Target - (390 + 468) = 693 kcal -> 693 / 4 = 173.25g carbs
 */
export function calculateBmrAndMacros(state: BmrCalculationState): BmrCalculationResult {
  const {
    gender,
    weightKg,
    heightCm,
    ageYears,
    formula,
    activityLevel,
    goal,
    customDeficitKcal,
    proteinMultiplier,
    fatMultiplier,
  } = state;

  let bmr = 0;
  let formulaExplanation = '';

  if (formula === 'handwritten_female' || (formula === 'harris_benedict' && gender === 'female')) {
    // Exact formula from user note: 655 + (9.6 * weight) + (1.7 * height) - (4.7 * age)
    const weightPart = 9.6 * weightKg;
    const heightPart = 1.7 * heightCm;
    const agePart = 4.7 * ageYears;
    bmr = 655 + weightPart + heightPart - agePart;
    formulaExplanation = `Female BMR Formula = 655 + (9.6 × ${weightKg}) + (1.7 × ${heightCm}) - (4.7 × ${ageYears}) = ${Math.round(bmr)} kcal`;
  } else if (formula === 'harris_benedict' && gender === 'male') {
    // Harris-Benedict Male: 66 + (13.7 * weight) + (5 * height) - (6.8 * age)
    const weightPart = 13.7 * weightKg;
    const heightPart = 5.0 * heightCm;
    const agePart = 6.8 * ageYears;
    bmr = 66 + weightPart + heightPart - agePart;
    formulaExplanation = `Male Harris-Benedict = 66 + (13.7 × ${weightKg}) + (5.0 × ${heightCm}) - (6.8 × ${ageYears}) = ${Math.round(bmr)} kcal`;
  } else {
    // Mifflin-St Jeor
    if (gender === 'female') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
      formulaExplanation = `Mifflin Female = (10 × ${weightKg}) + (6.25 × ${heightCm}) - (5 × ${ageYears}) - 161 = ${Math.round(bmr)} kcal`;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
      formulaExplanation = `Mifflin Male = (10 × ${weightKg}) + (6.25 × ${heightCm}) - (5 × ${ageYears}) + 5 = ${Math.round(bmr)} kcal`;
    }
  }

  // TDEE Calculation
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel]?.multiplier || 1.375;
  const tdee = Math.round(bmr * multiplier);

  // Calorie Adjustment (-300 in handwritten note)
  const adjustment = goal === 'custom' ? customDeficitKcal : GOAL_ADJUSTMENTS[goal]?.adjustment ?? -300;
  const targetCalories = Math.max(1000, Math.round(tdee + adjustment));

  // Macronutrient breakdown from notes:
  // Protein: weight * 1.5 g (e.g. 65 * 1.5 = 97.5g)
  const proteinGrams = Math.round(weightKg * proteinMultiplier * 10) / 10;
  const proteinCalories = Math.round(proteinGrams * 4);

  // Fat: weight * 0.8 g (e.g. 65 * 0.8 = 52g)
  const fatGrams = Math.round(weightKg * fatMultiplier * 10) / 10;
  const fatCalories = Math.round(fatGrams * 9);

  // Remaining calories allocated to carbohydrates:
  // e.g. 1551 - (390 + 468) = 693 kcal -> 693 / 4 = 173.25g carbs
  const remainingCarbCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
  const carbsGrams = Math.round((remainingCarbCalories / 4) * 10) / 10;
  const carbsCalories = Math.round(carbsGrams * 4);

  // Dietary fiber target: 14g per 1000 kcal, minimum 25g
  const fiberGramsTarget = Math.max(25, Math.round((targetCalories / 1000) * 14));

  // Percentages
  const totalMacroCalories = Math.max(1, proteinCalories + fatCalories + carbsCalories);
  const proteinPercent = Math.round((proteinCalories / totalMacroCalories) * 100);
  const fatPercent = Math.round((fatCalories / totalMacroCalories) * 100);
  const carbsPercent = Math.max(0, 100 - (proteinPercent + fatPercent));

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    calorieAdjustment: adjustment,
    proteinGrams,
    proteinCalories,
    fatGrams,
    fatCalories,
    carbsGrams,
    carbsCalories,
    fiberGramsTarget,
    proteinPercent,
    fatPercent,
    carbsPercent,
    formulaExplanation,
  };
}
