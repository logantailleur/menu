"use client";

import {
	Ingredient,
	Macro,
	Recipe,
	RecipeIngredient,
	Step,
} from "../types/recipe";

// Storage keys
const INGREDIENTS_KEY = "ingredients";
const STEPS_KEY = "steps";
const RECIPE_INGREDIENTS_KEY = "recipeIngredients";
const RECIPES_KEY = "recipes";

// Helper function to get items from localStorage
const getItems = <T>(key: string): T[] => {
	if (typeof window === "undefined") return [];
	try {
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
};

// Helper function to save items to localStorage
const saveItems = <T>(key: string, items: T[]): void => {
	if (typeof window === "undefined") return;
	localStorage.setItem(key, JSON.stringify(items));
};

// Ingredients CRUD
export const getIngredients = (): Ingredient[] => {
	return getItems<Ingredient>(INGREDIENTS_KEY);
};

export const saveIngredient = (
	ingredient: Omit<Ingredient, "id" | "createdAt">
): Ingredient => {
	const ingredients = getIngredients();
	const newIngredient: Ingredient = {
		...ingredient,
		id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
		createdAt: new Date().toISOString(),
	};
	ingredients.push(newIngredient);
	saveItems(INGREDIENTS_KEY, ingredients);
	return newIngredient;
};

export const updateIngredient = (
	id: string,
	ingredient: Partial<Omit<Ingredient, "id" | "createdAt">>
): Ingredient | null => {
	const ingredients = getIngredients();
	const index = ingredients.findIndex((i) => i.id === id);
	if (index === -1) return null;

	ingredients[index] = { ...ingredients[index], ...ingredient };
	saveItems(INGREDIENTS_KEY, ingredients);
	return ingredients[index];
};

export const deleteIngredient = (id: string): void => {
	const ingredients = getIngredients();
	const filtered = ingredients.filter((i) => i.id !== id);
	saveItems(INGREDIENTS_KEY, filtered);

	// Also delete recipe ingredients that reference this ingredient
	const recipeIngredients = getRecipeIngredients();
	const filteredRecipeIngredients = recipeIngredients.filter(
		(ri) => ri.ingredientId !== id
	);
	saveItems(RECIPE_INGREDIENTS_KEY, filteredRecipeIngredients);
};

export const getIngredientById = (id: string): Ingredient | null => {
	const ingredients = getIngredients();
	return ingredients.find((i) => i.id === id) || null;
};

// Steps CRUD
export const getSteps = (recipeId?: string): Step[] => {
	const steps = getItems<Step>(STEPS_KEY);
	if (recipeId) {
		return steps
			.filter((s) => s.recipeId === recipeId)
			.sort((a, b) => a.stepNumber - b.stepNumber);
	}
	return steps;
};

export const saveStep = (step: Omit<Step, "id" | "createdAt">): Step => {
	const steps = getSteps();
	const newStep: Step = {
		...step,
		id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
		createdAt: new Date().toISOString(),
	};
	steps.push(newStep);
	saveItems(STEPS_KEY, steps);
	return newStep;
};

export const updateStep = (
	id: string,
	step: Partial<Omit<Step, "id" | "createdAt">>
): Step | null => {
	const steps = getSteps();
	const index = steps.findIndex((s) => s.id === id);
	if (index === -1) return null;

	steps[index] = { ...steps[index], ...step };
	saveItems(STEPS_KEY, steps);
	return steps[index];
};

export const deleteStep = (id: string): void => {
	const steps = getSteps();
	const filtered = steps.filter((s) => s.id !== id);
	saveItems(STEPS_KEY, filtered);
};

export const deleteStepsByRecipeId = (recipeId: string): void => {
	const steps = getSteps();
	const filtered = steps.filter((s) => s.recipeId !== recipeId);
	saveItems(STEPS_KEY, filtered);
};

// Recipe Ingredients CRUD
export const getRecipeIngredients = (recipeId?: string): RecipeIngredient[] => {
	const recipeIngredients = getItems<RecipeIngredient>(
		RECIPE_INGREDIENTS_KEY
	);
	if (recipeId) {
		return recipeIngredients.filter((ri) => ri.recipeId === recipeId);
	}
	return recipeIngredients;
};

export const saveRecipeIngredient = (
	recipeIngredient: Omit<RecipeIngredient, "id" | "createdAt">
): RecipeIngredient => {
	const recipeIngredients = getRecipeIngredients();
	const newRecipeIngredient: RecipeIngredient = {
		...recipeIngredient,
		id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
		createdAt: new Date().toISOString(),
	};
	recipeIngredients.push(newRecipeIngredient);
	saveItems(RECIPE_INGREDIENTS_KEY, recipeIngredients);
	return newRecipeIngredient;
};

export const updateRecipeIngredient = (
	id: string,
	recipeIngredient: Partial<Omit<RecipeIngredient, "id" | "createdAt">>
): RecipeIngredient | null => {
	const recipeIngredients = getRecipeIngredients();
	const index = recipeIngredients.findIndex((ri) => ri.id === id);
	if (index === -1) return null;

	recipeIngredients[index] = {
		...recipeIngredients[index],
		...recipeIngredient,
	};
	saveItems(RECIPE_INGREDIENTS_KEY, recipeIngredients);
	return recipeIngredients[index];
};

export const deleteRecipeIngredient = (id: string): void => {
	const recipeIngredients = getRecipeIngredients();
	const filtered = recipeIngredients.filter((ri) => ri.id !== id);
	saveItems(RECIPE_INGREDIENTS_KEY, filtered);
};

export const deleteRecipeIngredientsByRecipeId = (recipeId: string): void => {
	const recipeIngredients = getRecipeIngredients();
	const filtered = recipeIngredients.filter((ri) => ri.recipeId !== recipeId);
	saveItems(RECIPE_INGREDIENTS_KEY, filtered);
};

// Recipes CRUD
export const getRecipes = (): Recipe[] => {
	return getItems<Recipe>(RECIPES_KEY);
};

export const saveRecipe = (
	recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">
): Recipe => {
	const recipes = getRecipes();
	const now = new Date().toISOString();
	const newRecipe: Recipe = {
		...recipe,
		id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
		createdAt: now,
		updatedAt: now,
	};
	recipes.push(newRecipe);
	saveItems(RECIPES_KEY, recipes);
	return newRecipe;
};

export const updateRecipe = (
	id: string,
	recipe: Partial<Omit<Recipe, "id" | "createdAt">>
): Recipe | null => {
	const recipes = getRecipes();
	const index = recipes.findIndex((r) => r.id === id);
	if (index === -1) return null;

	recipes[index] = {
		...recipes[index],
		...recipe,
		updatedAt: new Date().toISOString(),
	};
	saveItems(RECIPES_KEY, recipes);
	return recipes[index];
};

export const deleteRecipe = (id: string): void => {
	const recipes = getRecipes();
	const filtered = recipes.filter((r) => r.id !== id);
	saveItems(RECIPES_KEY, filtered);

	// Also delete associated steps and recipe ingredients
	deleteStepsByRecipeId(id);
	deleteRecipeIngredientsByRecipeId(id);
};

export const getRecipeById = (id: string): Recipe | null => {
	const recipes = getRecipes();
	return recipes.find((r) => r.id === id) || null;
};

// Helper function to parse serving size (e.g., "100g" -> { number: 100, unit: "g" })
const parseServingSize = (
	servingSize: string
): { number: number; unit: string } | null => {
	const match = servingSize.match(/^(\d+(?:\.\d+)?)\s*(\w+)$/);
	if (!match) return null;
	return {
		number: parseFloat(match[1]),
		unit: match[2],
	};
};

// Helper function to calculate recipe macros
export const calculateRecipeMacros = (
	recipeId: string,
	servings: number
): Macro => {
	const recipeIngredients = getRecipeIngredients(recipeId);
	const ingredients = getIngredients();

	const totalMacros: Macro = {
		calories: 0,
		protein: 0,
		carbs: 0,
		fat: 0,
		fiber: 0,
		sugar: 0,
	};

	recipeIngredients.forEach((ri) => {
		const ingredient = ingredients.find((i) => i.id === ri.ingredientId);
		if (!ingredient) return;

		// Parse serving size to get the number and unit
		const servingSizeParsed = parseServingSize(ingredient.servingSize);
		if (!servingSizeParsed) return;

		// Calculate multiplier: how many servings of the ingredient are used
		// If recipe uses same unit as serving size, calculate servings
		// Example: ingredient serving size is "100g", recipe uses "200g" = 2 servings
		let multiplier = 1;
		if (ri.unit === servingSizeParsed.unit) {
			// Same unit, calculate how many servings
			multiplier = ri.quantity / servingSizeParsed.number;
		} else {
			// Different units - for now, assume 1:1 ratio (simplified)
			// In a real app, you'd need unit conversion logic
			multiplier = ri.quantity / servingSizeParsed.number;
		}

		const macros = ingredient.macrosPerServing;
		totalMacros.calories += macros.calories * multiplier;
		totalMacros.protein += macros.protein * multiplier;
		totalMacros.carbs += macros.carbs * multiplier;
		totalMacros.fat += macros.fat * multiplier;
		if (macros.fiber !== undefined) {
			totalMacros.fiber =
				(totalMacros.fiber || 0) + macros.fiber * multiplier;
		}
		if (macros.sugar !== undefined) {
			totalMacros.sugar =
				(totalMacros.sugar || 0) + macros.sugar * multiplier;
		}
	});

	// Calculate per serving
	if (servings > 0) {
		totalMacros.calories = Math.round(totalMacros.calories / servings);
		totalMacros.protein =
			Math.round((totalMacros.protein * 10) / servings) / 10;
		totalMacros.carbs =
			Math.round((totalMacros.carbs * 10) / servings) / 10;
		totalMacros.fat = Math.round((totalMacros.fat * 10) / servings) / 10;
		if (totalMacros.fiber !== undefined) {
			totalMacros.fiber =
				Math.round((totalMacros.fiber * 10) / servings) / 10;
		}
		if (totalMacros.sugar !== undefined) {
			totalMacros.sugar =
				Math.round((totalMacros.sugar * 10) / servings) / 10;
		}
	}

	return totalMacros;
};

// Helper function to parse serving size for ingredient form
export const parseIngredientServingSize = (
	servingSize: string
): { number: string; unit: string } | null => {
	const match = servingSize.match(/^(\d+(?:\.\d+)?)\s*(\w+)$/);
	if (!match) return null;
	return {
		number: match[1],
		unit: match[2],
	};
};
