"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Ingredient, Recipe } from "../types/recipe";
import { calculateMacrosFromIngredients } from "../utils/calculations";
import LoadingSpinner from "../components/LoadingSpinner";
import RecipeCard from "../components/RecipeCard";

interface PublicRecipe extends Recipe {
	recipeIngredients: any[];
	steps: any[];
	user: {
		email: string;
	};
}

export default function PublicRecipesPage() {
	const [recipes, setRecipes] = useState<PublicRecipe[]>([]);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [loading, setLoading] = useState(true);
	const loadingRef = useRef(false);
	const mountedRef = useRef(false);

	useEffect(() => {
		// Prevent duplicate calls from React Strict Mode or re-renders
		if (mountedRef.current || loadingRef.current) return;
		mountedRef.current = true;
		loadPublicRecipes();
	}, []);

	const loadPublicRecipes = async () => {
		if (loadingRef.current) return;
		loadingRef.current = true;

		try {
			setLoading(true);
			const response = await fetch('/api/recipes/public');
			if (!response.ok) throw new Error('Failed to fetch public recipes');
			const data = await response.json();
			setRecipes(data);
			
			// Extract unique ingredients from all recipes
			const allIngredients: Ingredient[] = [];
			data.forEach((recipe: PublicRecipe) => {
				recipe.recipeIngredients.forEach((ri) => {
					if (ri.ingredient && !allIngredients.find((i) => i.id === ri.ingredient.id)) {
					allIngredients.push({
						id: ri.ingredient.id,
						name: ri.ingredient.name,
						macrosPerServing: {
							calories: ri.ingredient.calories ?? undefined,
							protein: ri.ingredient.protein,
							carbs: ri.ingredient.carbs,
							fat: ri.ingredient.fat,
							fiber: ri.ingredient.fiber,
							sugar: ri.ingredient.sugar,
						},
						createdAt: ri.ingredient.createdAt,
					});
					}
				});
			});
			setIngredients(allIngredients);
		} catch (error) {
			console.error('Failed to load public recipes:', error);
		} finally {
			setLoading(false);
			loadingRef.current = false;
		}
	};

	const handleRecipeClick = async (recipeId: string) => {
		try {
			await fetch(`/api/recipes/${recipeId}/views`, {
				method: 'POST',
			});
		} catch (error) {
			console.error('Failed to increment views:', error);
		}
	};

	const getRecipeMacros = (recipe: PublicRecipe) => {
		return calculateMacrosFromIngredients(
			recipe.recipeIngredients.map((ri) => ({
				ingredientId: ri.ingredientId,
				quantity: ri.quantity,
				unit: ri.unit,
			})),
			ingredients,
			recipe.servings
		);
	};

	const getIngredientName = (ingredientId: string) => {
		const ingredient = ingredients.find((i) => i.id === ingredientId);
		return ingredient ? ingredient.name : "";
	};

	if (loading) {
		return (
			<div className="fixed inset-0 flex items-center justify-center z-40">
				<LoadingSpinner object="recipes" />
			</div>
		);
	}

	return (
		<>
			<div className="mb-6">
				<h1 className="heading-1 mb-2">Public Recipes</h1>
				<p className="text-primary-muted text-sm sm:text-base">
					Discover recipes shared by our community
				</p>
			</div>

				{recipes.length === 0 ? (
					<div className="empty-state">
						<div className="empty-state-card">
							<h2 className="heading-2 mb-3 sm:mb-4">No public recipes yet</h2>
							<p className="text-primary-muted mb-4 sm:mb-6 text-sm sm:text-base">
								Be the first to share a recipe! Sign in to get started.
							</p>
							<Link href="/login">
								<button className="btn-primary btn-full text-sm sm:text-base">
									Sign In
								</button>
							</Link>
						</div>
					</div>
				) : (
					<div className="grid-responsive">
						{recipes.map((recipe) => {
							const macros = getRecipeMacros(recipe);
							return (
								<RecipeCard
									key={recipe.id}
									recipe={recipe}
									macros={macros}
									recipeIngredients={recipe.recipeIngredients.map((ri) => ({
										id: ri.id,
										ingredientId: ri.ingredientId,
										quantity: ri.quantity,
										unit: ri.unit,
									}))}
									steps={recipe.steps.map((step) => ({
										id: step.id,
										stepNumber: step.stepNumber,
										instruction: step.instruction,
										duration: step.duration,
									}))}
									getIngredientName={getIngredientName}
									onClick={() => handleRecipeClick(recipe.id)}
									showAuthor={true}
									authorEmail={recipe.user.email}
								/>
							);
						})}
					</div>
				)}
		</>
	);
}

