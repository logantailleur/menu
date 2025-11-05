"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Ingredient, Recipe } from "../types/recipe";
import { calculateMacrosFromIngredients } from "../utils/calculations";
import LoadingSpinner from "../components/LoadingSpinner";

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
								<div
									key={recipe.id}
									className="card-small hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
									onClick={() => handleRecipeClick(recipe.id)}
								>
									<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2">
										<div className="flex-1">
											<h2 className="text-xl sm:text-2xl font-bold text-primary mb-1 sm:mb-2">
												{recipe.name}
											</h2>
											{recipe.description && (
												<p className="text-primary-muted text-xs sm:text-sm mb-1 sm:mb-2">
													{recipe.description}
												</p>
											)}
											<div className="flex flex-wrap gap-2 text-xs sm:text-sm text-primary-muted">
												<span>Serves: {recipe.servings}</span>
												<span>•</span>
												<span>By: {recipe.user.email}</span>
												{recipe.views !== undefined && recipe.views > 0 && (
													<>
														<span>•</span>
														<span>{recipe.views} {recipe.views === 1 ? 'view' : 'views'}</span>
													</>
												)}
											</div>
										</div>
									</div>

									<div className="mb-3 sm:mb-4">
										<h3 className="heading-3">Macros per Serving</h3>
										<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
											{macros.calories !== undefined && (
												<div className="macro-card">
													<div className="macro-label">Calories</div>
													<div className="macro-value">{macros.calories}</div>
												</div>
											)}
											<div className="macro-card">
												<div className="macro-label">Protein</div>
												<div className="macro-value">{macros.protein}g</div>
											</div>
											<div className="macro-card">
												<div className="macro-label">Carbs</div>
												<div className="macro-value">{macros.carbs}g</div>
											</div>
											<div className="macro-card">
												<div className="macro-label">Fat</div>
												<div className="macro-value">{macros.fat}g</div>
											</div>
											{macros.fiber !== undefined && macros.fiber > 0 && (
												<div className="macro-card">
													<div className="macro-label">Fiber</div>
													<div className="macro-value">{macros.fiber}g</div>
												</div>
											)}
											{macros.sugar !== undefined && macros.sugar > 0 && (
												<div className="macro-card">
													<div className="macro-label">Sugar</div>
													<div className="macro-value">{macros.sugar}g</div>
												</div>
											)}
										</div>
									</div>

									<div className="mb-3 sm:mb-4">
										<h3 className="heading-3">Ingredients</h3>
										<ul className="space-y-1 sm:space-y-1.5">
											{recipe.recipeIngredients.map((ri) => (
												<li
													key={ri.id}
													className="text-primary-muted text-xs sm:text-sm flex items-start"
												>
													<span className="text-secondary mr-2">•</span>
													<span>
														{ri.quantity} {ri.unit} {ri.ingredient?.name || 'Unknown'}
													</span>
												</li>
											))}
										</ul>
									</div>

									<div>
										<h3 className="heading-3">Steps</h3>
										<ol className="space-y-2 sm:space-y-3 pl-2 sm:pl-4">
											{recipe.steps.map((step) => (
												<li
													key={step.id}
													className="text-primary-muted text-xs sm:text-sm"
												>
													<div className="flex items-start">
														<span className="step-number">{step.stepNumber}</span>
														<div className="flex-1">
															<div>{step.instruction}</div>
															{step.duration && (
																<div className="text-primary-muted text-xs mt-1">
																	⏱️ {step.duration} minutes
																</div>
															)}
														</div>
													</div>
												</li>
											))}
										</ol>
									</div>
								</div>
							);
						})}
					</div>
				)}
		</>
	);
}

