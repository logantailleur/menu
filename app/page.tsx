"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute";
import RecipeCard from "./components/RecipeCard";
import { useAuth } from "./contexts/AuthContext";
import { Ingredient, Recipe } from "./types/recipe";
import { calculateMacrosFromIngredients } from "./utils/calculations";
import { useStorage } from "./utils/storage-api";

export default function Home() {
	return (
		<ProtectedRoute>
			<HomeContent />
		</ProtectedRoute>
	);
}

function HomeContent() {
	const { session, loading: authLoading } = useAuth();
	const storage = useStorage();
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [loading, setLoading] = useState(true);
	const [recipesWithData, setRecipesWithData] = useState<Record<string, any>>(
		{}
	);
	const loadingRef = useRef(false);
	const sessionTokenRef = useRef<string | null>(null);

	const storageRef = useRef(storage);
	storageRef.current = storage; // Keep ref updated

	const loadData = useCallback(async () => {
		// Prevent duplicate calls
		if (loadingRef.current) return;
		if (!session?.access_token) return;

		// Prevent calling if we already loaded with this token
		if (sessionTokenRef.current === session.access_token) return;

		loadingRef.current = true;
		sessionTokenRef.current = session.access_token;

		try {
			setLoading(true);
			// Fetch recipes with full data (includes ingredients via relation)
			const fullRecipesData = await storageRef.current.getFullRecipes();

			// Extract unique ingredients from recipes
			const ingredientsMap = new Map<string, any>();
			fullRecipesData.forEach((recipe: any) => {
				recipe.recipeIngredients?.forEach((ri: any) => {
					if (
						ri.ingredient &&
						!ingredientsMap.has(ri.ingredient.id)
					) {
						ingredientsMap.set(ri.ingredient.id, ri.ingredient);
					}
				});
			});
			const ingredientsData = Array.from(ingredientsMap.values()).map(
				(ing: any) => ({
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
				})
			);
			setIngredients(ingredientsData);

			// Process recipes: extract basic info and full data
			const recipesList: Recipe[] = [];
			const recipesDataMap: Record<string, any> = {};

			fullRecipesData.forEach((recipe: any) => {
				// Store basic recipe info
				recipesList.push({
					id: recipe.id,
					name: recipe.name,
					description: recipe.description || "",
					servings: recipe.servings,
					isPublic: recipe.isPublic || false,
					views: recipe.views || 0,
					createdAt: recipe.createdAt,
					updatedAt: recipe.updatedAt,
				});

				// Process recipe ingredients
				const recipeIngredients = recipe.recipeIngredients.map(
					(ri: any) => ({
						id: ri.id,
						recipeId: ri.recipeId,
						ingredientId: ri.ingredientId,
						quantity: ri.quantity,
						unit: ri.unit,
						createdAt: ri.createdAt,
					})
				);

				// Process steps
				const steps = recipe.steps.map((step: any) => ({
					id: step.id,
					recipeId: step.recipeId,
					stepNumber: step.stepNumber,
					instruction: step.instruction,
					duration: step.duration,
					createdAt: step.createdAt,
				}));

				// Calculate macros
				const macros = calculateMacrosFromIngredients(
					recipeIngredients.map(
						(ri: {
							ingredientId: string;
							quantity: number;
							unit: string;
						}) => ({
							ingredientId: ri.ingredientId,
							quantity: ri.quantity,
							unit: ri.unit,
						})
					),
					ingredientsData,
					recipe.servings
				);

				recipesDataMap[recipe.id] = {
					recipeIngredients,
					steps,
					macros,
				};
			});

			setRecipes(recipesList);
			setRecipesWithData(recipesDataMap);
		} catch (error) {
			console.error("Failed to load data:", error);
			sessionTokenRef.current = null; // Reset on error so we can retry
		} finally {
			setLoading(false);
			loadingRef.current = false;
		}
	}, [session?.access_token]); // Removed storage from dependencies

	useEffect(() => {
		// Wait for auth to finish loading before making API calls
		if (authLoading) return;
		if (!session?.access_token) return;

		// Skip if already loaded or currently loading
		if (loadingRef.current) return;
		if (sessionTokenRef.current === session.access_token) return;

		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session?.access_token, authLoading]); // Wait for auth loading to complete

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this recipe?")) {
			// Optimistically remove from local state
			const previousRecipe = recipes.find((r) => r.id === id);
			const previousRecipeData = recipesWithData[id];
			if (!previousRecipe) return;

			setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
			setRecipesWithData((prev) => {
				const next = { ...prev };
				delete next[id];
				return next;
			});

			try {
				await storage.deleteRecipe(id);
			} catch (error) {
				// Revert on error
				setRecipes((prev) =>
					[...prev, previousRecipe].sort(
						(a, b) =>
							new Date(b.createdAt).getTime() -
							new Date(a.createdAt).getTime()
					)
				);
				if (previousRecipeData) {
					setRecipesWithData((prev) => ({
						...prev,
						[id]: previousRecipeData,
					}));
				}
				console.error("Failed to delete recipe:", error);
				alert("Failed to delete recipe");
			}
		}
	};

	const handleTogglePublic = async (id: string, isPublic: boolean) => {
		// Optimistically update local state
		const previousRecipe = recipes.find((r) => r.id === id);
		if (!previousRecipe) return;

		setRecipes((prev) =>
			prev.map((recipe) =>
				recipe.id === id ? { ...recipe, isPublic } : recipe
			)
		);

		try {
			await storage.toggleRecipePublic(id, isPublic);
		} catch (error) {
			// Revert on error
			setRecipes((prev) =>
				prev.map((recipe) =>
					recipe.id === id ? previousRecipe : recipe
				)
			);
			console.error("Failed to toggle recipe public status:", error);
			alert("Failed to update recipe visibility");
		}
	};

	const getIngredientName = (ingredientId: string) => {
		const ingredient = ingredients.find((i) => i.id === ingredientId);
		return ingredient ? ingredient.name : "";
	};

	if (authLoading || loading) {
		return (
			<div className="fixed inset-0 flex items-center justify-center z-40">
				<LoadingSpinner object="recipes" />
			</div>
		);
	}

	return (
		<>
			<h1 className="heading-1">My Recipes</h1>

			{recipes.length === 0 ? (
				<div className="empty-state">
					<div className="empty-state-card">
						<h2 className="heading-2 mb-3 sm:mb-4">
							No recipes yet
						</h2>
						<p className="text-primary-muted mb-4 sm:mb-6 text-sm sm:text-base">
							Get started by adding your first recipe! 🍳
						</p>
						<Link href="/add">
							<button className="btn-primary btn-full text-sm sm:text-base">
								Add Recipe
							</button>
						</Link>
					</div>
				</div>
			) : (
				<RecipeGrid
					recipes={recipes}
					ingredients={ingredients}
					recipesWithData={recipesWithData}
					getIngredientName={getIngredientName}
					handleDelete={handleDelete}
					handleTogglePublic={handleTogglePublic}
				/>
			)}
		</>
	);
}

function RecipeGrid({
	recipes,
	ingredients,
	recipesWithData,
	getIngredientName,
	handleDelete,
	handleTogglePublic,
}: {
	recipes: Recipe[];
	ingredients: Ingredient[];
	recipesWithData: Record<string, any>;
	getIngredientName: (id: string) => string;
	handleDelete: (id: string) => void;
	handleTogglePublic: (id: string, isPublic: boolean) => void;
}) {
	return (
		<div className="grid-responsive">
			{recipes.map((recipe) => {
				const data = recipesWithData[recipe.id];
				if (!data) {
					return (
						<div key={recipe.id} className="card-small">
							<LoadingSpinner object="recipe" />
						</div>
					);
				}

				const { recipeIngredients, steps, macros } = data;

				return (
					<RecipeCard
						key={recipe.id}
						recipe={recipe}
						macros={macros}
						recipeIngredients={recipeIngredients}
						steps={steps}
						getIngredientName={getIngredientName}
						onDelete={handleDelete}
						onTogglePublic={handleTogglePublic}
					/>
				);
			})}
		</div>
	);
}
