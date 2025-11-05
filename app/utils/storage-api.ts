"use client";

import { useApiClient } from '../lib/api-client';
import {
	Ingredient,
	Macro,
	Recipe,
	RecipeIngredient,
	Step,
} from '../types/recipe';

const mapIngredient = (ing: any): Ingredient => ({
	id: ing.id,
	name: ing.name,
	macrosPerServing: {
		calories: ing.calories ?? undefined,
		protein: ing.protein,
		carbs: ing.carbs,
		fat: ing.fat,
		fiber: ing.fiber,
		sugar: ing.sugar,
	},
	createdAt: ing.createdAt,
});

const mapRecipe = (recipe: any): Recipe => ({
	id: recipe.id,
	name: recipe.name,
	description: recipe.description || '',
	servings: recipe.servings,
	isPublic: recipe.isPublic || false,
	views: recipe.views || 0,
	createdAt: recipe.createdAt,
	updatedAt: recipe.updatedAt,
});

export function useStorage() {
	const api = useApiClient();

	// Ingredients CRUD
	const getIngredients = async (): Promise<Ingredient[]> => {
		try {
			const data = await api.get<any[]>('/api/ingredients');
			return data.map(mapIngredient);
		} catch (error) {
			if (error instanceof Error && error.message === 'Not authenticated') {
				return [];
			}
			throw error;
		}
	};


	const saveIngredient = async (
		ingredient: Omit<Ingredient, 'id' | 'createdAt'>
	): Promise<Ingredient> => {
		const data = await api.post<any>('/api/ingredients', {
			name: ingredient.name,
			macrosPerServing: ingredient.macrosPerServing,
		});
		return mapIngredient(data);
	};

	const deleteIngredient = async (id: string): Promise<void> => {
		await api.delete(`/api/ingredients?id=${id}`);
	};

	// Recipes CRUD
	const getRecipes = async (): Promise<Recipe[]> => {
		try {
			const data = await api.get<any[]>('/api/recipes');
			return data.map(mapRecipe);
		} catch (error) {
			if (error instanceof Error && error.message === 'Not authenticated') {
				return [];
			}
			throw error;
		}
	};

	const getFullRecipes = async (): Promise<any[]> => {
		try {
			return await api.get<any[]>('/api/recipes');
		} catch (error) {
			if (error instanceof Error && error.message === 'Not authenticated') {
				return [];
			}
			throw error;
		}
	};

	const saveRecipe = async (
		recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>,
		recipeIngredients: Omit<RecipeIngredient, 'id' | 'createdAt'>[],
		steps: Omit<Step, 'id' | 'createdAt'>[]
	): Promise<Recipe> => {
		const data = await api.post<any>('/api/recipes', {
			name: recipe.name,
			description: recipe.description,
			servings: recipe.servings,
			ingredients: recipeIngredients.map((ri) => ({
				ingredientId: ri.ingredientId,
				quantity: ri.quantity,
				unit: ri.unit,
			})),
			steps: steps.map((step) => ({
				stepNumber: step.stepNumber,
				instruction: step.instruction,
				duration: step.duration,
			})),
		});
		return mapRecipe(data);
	};

	const deleteRecipe = async (id: string): Promise<void> => {
		await api.delete(`/api/recipes?id=${id}`);
	};

	const toggleRecipePublic = async (id: string, isPublic: boolean): Promise<void> => {
		await api.patch('/api/recipes', { id, isPublic });
	};

	const incrementRecipeViews = async (id: string): Promise<number> => {
		const data = await api.post<{ views: number }>(`/api/recipes/${id}/views`);
		return data.views;
	};

	// Recipe Ingredients
	const getRecipeIngredients = async (recipeId: string): Promise<RecipeIngredient[]> => {
		try {
			const data = await api.get<any[]>('/api/recipes');
			const recipe = data.find((r: any) => r.id === recipeId);
			if (!recipe) return [];
			return recipe.recipeIngredients.map((ri: any) => ({
				id: ri.id,
				recipeId: ri.recipeId,
				ingredientId: ri.ingredientId,
				quantity: ri.quantity,
				unit: ri.unit,
				createdAt: ri.createdAt,
			}));
		} catch (error) {
			if (error instanceof Error && error.message === 'Not authenticated') {
				return [];
			}
			throw error;
		}
	};

	// Steps
	const getSteps = async (recipeId: string): Promise<Step[]> => {
		try {
			const data = await api.get<any[]>('/api/recipes');
			const recipe = data.find((r: any) => r.id === recipeId);
			if (!recipe) return [];
			return recipe.steps.map((step: any) => ({
				id: step.id,
				recipeId: step.recipeId,
				stepNumber: step.stepNumber,
				instruction: step.instruction,
				duration: step.duration,
				createdAt: step.createdAt,
			}));
		} catch (error) {
			if (error instanceof Error && error.message === 'Not authenticated') {
				return [];
			}
			throw error;
		}
	};

	// Helper function to calculate recipe macros (kept for compatibility)
	const calculateRecipeMacros = async (
		recipeId: string,
		servings: number
	): Promise<Macro> => {
		const recipeIngredients = await getRecipeIngredients(recipeId);
		const ingredients = await getIngredients();

		const { calculateMacrosFromIngredients } = await import('./calculations');
		
		return calculateMacrosFromIngredients(
			recipeIngredients.map((ri) => ({
				ingredientId: ri.ingredientId,
				quantity: ri.quantity,
				unit: ri.unit,
			})),
			ingredients,
			servings
		);
	};

	return {
		getIngredients,
		saveIngredient,
		deleteIngredient,
		getRecipes,
		getFullRecipes,
		saveRecipe,
		deleteRecipe,
		toggleRecipePublic,
		incrementRecipeViews,
		getRecipeIngredients,
		getSteps,
		calculateRecipeMacros,
	};
}

// Export helper function for backward compatibility
export { parseIngredientServingSize } from './storage';

