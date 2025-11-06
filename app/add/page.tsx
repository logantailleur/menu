"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import MacrosDisplay from "../components/MacrosDisplay";
import RecipeForm, {
	RecipeIngredientForm,
} from "../components/RecipeForm";
import ProtectedRoute from "../components/ProtectedRoute";
import { Ingredient, Macro, RecipeIngredient, Step } from "../types/recipe";
import { calculateMacrosFromIngredients } from "../utils/calculations";
import { useStorage } from "../utils/storage-api";

function AddRecipeContent() {
	const router = useRouter();
	const storage = useStorage();
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [servings, setServings] = useState(1);
	const [loading, setLoading] = useState(true);
	const [recipeIngredients, setRecipeIngredients] = useState<
		RecipeIngredientForm[]
	>([
		{
			ingredientId: "",
			quantity: 1,
			unit: "",
			searchTerm: "",
			showSuggestions: false,
		},
	]);
	const storageRef = useRef(storage);
	storageRef.current = storage; // Keep ref updated
	const mountedRef = useRef(true);

	useEffect(() => {
		mountedRef.current = true;
		loadIngredients();

		return () => {
			mountedRef.current = false;
		};
	}, []);

	const loadIngredients = async () => {
		try {
			setLoading(true);
			// Load user's own ingredients for recipe creation
			const data = await storageRef.current.getIngredients();

			// Only update state if component is still mounted
			if (!mountedRef.current) return;

			setIngredients(data);
		} catch (error) {
			if (!mountedRef.current) return;
			console.error("Failed to load ingredients:", error);
		} finally {
			if (mountedRef.current) {
				setLoading(false);
			}
		}
	};

	const currentMacros: Macro = useMemo(() => {
		return calculateMacrosFromIngredients(
			recipeIngredients.map((ri) => ({
				ingredientId: ri.ingredientId,
				quantity: ri.quantity,
				unit: ri.unit,
			})),
			ingredients,
			servings
		);
	}, [recipeIngredients, ingredients, servings]);


	const handleRefreshIngredients = (newIngredient?: Ingredient) => {
		if (newIngredient) {
			// Optimistically add the new ingredient to local state
			setIngredients((prev) => [newIngredient, ...prev]);
		} else {
			// Fallback: reload all ingredients if ingredient not provided
			loadIngredients();
		}
	};

	const handleSubmit = async (
		recipeIngredientsData: Omit<RecipeIngredient, "id" | "createdAt">[],
		stepsData: Omit<Step, "id" | "createdAt">[]
	) => {
		try {
			await storage.saveRecipe(
				{
					name: name.trim(),
					description: description.trim(),
					servings: servings,
				},
				recipeIngredientsData,
				stepsData
			);

			router.push("/");
		} catch (error) {
			console.error("Failed to save recipe:", error);
			alert("Failed to save recipe. Please try again.");
		}
	};

	return (
		<div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
			<div className="lg:w-80 lg:flex-shrink-0">
				<MacrosDisplay macros={currentMacros} servings={servings} />
			</div>

			<div className="flex-1">
				<RecipeForm
					ingredients={ingredients}
					name={name}
					description={description}
					servings={servings}
					onNameChange={setName}
					onDescriptionChange={setDescription}
					onServingsChange={setServings}
					onSubmit={handleSubmit}
					onIngredientRefresh={handleRefreshIngredients}
					onRecipeIngredientsChange={setRecipeIngredients}
				/>
			</div>
		</div>
	);
}

export default function AddRecipe() {
	return (
		<ProtectedRoute>
			<AddRecipeContent />
		</ProtectedRoute>
	);
}
