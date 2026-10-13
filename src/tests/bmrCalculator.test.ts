import { describe, it, expect } from 'vitest';
import { calculateBmrAndMacros } from '../lib/bmrCalculator';
import { BmrCalculationState } from '../types/diet';

describe('BMR & Macro Calculation Engine (Handwritten Formula Verification)', () => {
  it('correctly calculates Female BMR from the handwritten notes', () => {
    // Note formula: 655 + (9.6 * weight) + (1.7 * height) - (4.7 * age)
    // Weight = 65kg, Height = 163cm, Age = 28yrs
    // 655 + (9.6 * 65) + (1.7 * 163) - (4.7 * 28)
    // 655 + 624 + 277.1 - 131.6 = 1424.5
    const state: BmrCalculationState = {
      gender: 'female',
      weightKg: 65,
      heightCm: 163,
      ageYears: 28,
      formula: 'handwritten_female',
      activityLevel: 'moderate', // 1.55 multiplier approx
      goal: 'fat_loss_moderate', // -300 kcal
      customDeficitKcal: -300,
      proteinMultiplier: 1.5, // 65 * 1.5 = 97.5g
      fatMultiplier: 0.8, // 65 * 0.8 = 52g
    };

    const result = calculateBmrAndMacros(state);

    // Verify BMR is around 1425
    expect(result.bmr).toBeGreaterThan(1400);
    expect(result.bmr).toBeLessThan(1450);

    // Verify Deficit is -300
    expect(result.calorieAdjustment).toBe(-300);

    // Verify Protein: 65 * 1.5 = 97.5g (which yields ~390 kcal as noted in handwritten paper)
    expect(result.proteinGrams).toBe(97.5);
    expect(result.proteinCalories).toBe(390);

    // Verify Fat: 65 * 0.8 = 52g (which yields 468 kcal as noted in handwritten paper)
    expect(result.fatGrams).toBe(52);
    expect(result.fatCalories).toBe(468);

    // Verify Carbs: Target - (390 + 468), divided by 4
    const expectedRemaining = result.targetCalories - (390 + 468);
    expect(result.carbsCalories).toBe(expectedRemaining);
    expect(result.carbsGrams).toBeCloseTo(expectedRemaining / 4, 0);

    // Verify daily fiber target
    expect(result.fiberGramsTarget).toBeGreaterThanOrEqual(25);
  });

  it('correctly allocates remaining calories to carbohydrates', () => {
    const state: BmrCalculationState = {
      gender: 'female',
      weightKg: 60,
      heightCm: 160,
      ageYears: 25,
      formula: 'handwritten_female',
      activityLevel: 'light',
      goal: 'maintain',
      customDeficitKcal: 0,
      proteinMultiplier: 1.5,
      fatMultiplier: 0.8,
    };

    const res = calculateBmrAndMacros(state);
    const sumCalories = res.proteinCalories + res.fatCalories + res.carbsCalories;
    expect(Math.abs(sumCalories - res.targetCalories)).toBeLessThanOrEqual(4);
  });
});
