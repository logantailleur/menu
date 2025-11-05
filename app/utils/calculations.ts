import { Macro } from '../types/recipe';
import { Ingredient } from '../types/recipe';

/**
 * Calculate calories from macros
 * Formula: (protein * 4) + (carbs * 4) + (fat * 9)
 */
export const calculateCalories = (protein: number, carbs: number, fat: number): number => {
  return Math.round((protein * 4) + (carbs * 4) + (fat * 9));
};

/**
 * Convert quantity to grams based on unit
 * This is a simplified conversion - in a real app, you'd want more comprehensive unit conversion
 */
const convertToGrams = (quantity: number, unit: string): number => {
  const unitLower = unit.toLowerCase().trim();
  
  // Weight conversions
  if (unitLower === 'g' || unitLower === 'gram' || unitLower === 'grams') {
    return quantity;
  }
  if (unitLower === 'kg' || unitLower === 'kilogram' || unitLower === 'kilograms') {
    return quantity * 1000;
  }
  if (unitLower === 'oz' || unitLower === 'ounce' || unitLower === 'ounces') {
    return quantity * 28.35;
  }
  if (unitLower === 'lb' || unitLower === 'pound' || unitLower === 'pounds') {
    return quantity * 453.592;
  }
  
  // Volume conversions (approximate - assumes water density)
  // For more accuracy, you'd need ingredient-specific densities
  if (unitLower === 'ml' || unitLower === 'milliliter' || unitLower === 'milliliters') {
    return quantity; // 1 ml ≈ 1g for water
  }
  if (unitLower === 'l' || unitLower === 'liter' || unitLower === 'liters') {
    return quantity * 1000;
  }
  if (unitLower === 'cup' || unitLower === 'cups') {
    return quantity * 240; // 1 cup ≈ 240g for water
  }
  if (unitLower === 'tbsp' || unitLower === 'tablespoon' || unitLower === 'tablespoons') {
    return quantity * 15; // 1 tbsp ≈ 15g for water
  }
  if (unitLower === 'tsp' || unitLower === 'teaspoon' || unitLower === 'teaspoons') {
    return quantity * 5; // 1 tsp ≈ 5g for water
  }
  
  // For other units (piece, slice, whole), assume 1 unit = 1g as fallback
  // In a real app, you'd want ingredient-specific defaults
  return quantity;
};

interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
  unit: string;
}

/**
 * Calculate macros from recipe ingredients (for form state)
 * Ingredients store macros per 100g, so we convert recipe quantities to grams and calculate accordingly
 */
export const calculateMacrosFromIngredients = (
  recipeIngredients: RecipeIngredient[],
  ingredients: Ingredient[],
  servings: number
): Macro => {
  const totalMacros: Macro = {
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  };

  recipeIngredients.forEach((ri) => {
    if (!ri.ingredientId || ri.quantity <= 0) return;

    const ingredient = ingredients.find((i) => i.id === ri.ingredientId);
    if (!ingredient) return;

    // Convert recipe ingredient quantity to grams
    const quantityInGrams = convertToGrams(ri.quantity, ri.unit);
    
    // Calculate multiplier: how many "100g portions" are used
    const multiplier = quantityInGrams / 100;

    const macros = ingredient.macrosPerServing;
    
    // Use calculated calories if override not provided
    const caloriesPer100g = macros.calories !== undefined 
      ? macros.calories 
      : calculateCalories(macros.protein, macros.carbs, macros.fat);
    
    if (totalMacros.calories === undefined) {
      totalMacros.calories = 0;
    }
    totalMacros.calories += caloriesPer100g * multiplier;
    totalMacros.protein += macros.protein * multiplier;
    totalMacros.carbs += macros.carbs * multiplier;
    totalMacros.fat += macros.fat * multiplier;
    totalMacros.fiber += macros.fiber * multiplier;
    totalMacros.sugar += macros.sugar * multiplier;
  });

  // Calculate per serving
  if (servings > 0) {
    if (totalMacros.calories !== undefined) {
      totalMacros.calories = Math.round(totalMacros.calories / servings);
    }
    totalMacros.protein = Math.round((totalMacros.protein * 10) / servings) / 10;
    totalMacros.carbs = Math.round((totalMacros.carbs * 10) / servings) / 10;
    totalMacros.fat = Math.round((totalMacros.fat * 10) / servings) / 10;
    totalMacros.fiber = Math.round((totalMacros.fiber * 10) / servings) / 10;
    totalMacros.sugar = Math.round((totalMacros.sugar * 10) / servings) / 10;
  }

  return totalMacros;
};
