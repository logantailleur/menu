export interface Macro {
  calories?: number; // Optional - overrides calculated calories if provided
  protein: number; // grams per 100g
  carbs: number; // grams per 100g
  fat: number; // grams per 100g
  fiber: number; // grams per 100g
  sugar: number; // grams per 100g
}

export interface Ingredient {
  id: string;
  name: string;
  macrosPerServing: Macro; // All macros are per 100g
  createdAt: string;
}

export interface Step {
  id: string;
  recipeId: string;
  stepNumber: number;
  instruction: string;
  duration?: number; // minutes
  createdAt: string;
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  ingredientId: string;
  quantity: number;
  unit: string; // e.g., "cups", "tbsp", "g"
  createdAt: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  servings: number;
  isPublic?: boolean;
  views?: number;
  createdAt: string;
  updatedAt: string;
}
