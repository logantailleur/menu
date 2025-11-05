"use client";

import { useEffect, useRef, useState } from "react";
import IngredientModal from "../components/IngredientModal";
import LoadingSpinner from "../components/LoadingSpinner";
import ProtectedRoute from "../components/ProtectedRoute";
import { Ingredient } from "../types/recipe";
import { useStorage } from "../utils/storage-api";

function IngredientsPageContent() {
	const storage = useStorage();
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(true);
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

	const handleRefresh = (newIngredient?: Ingredient) => {
		if (newIngredient) {
			// Optimistically add the new ingredient to local state
			setIngredients((prev) => [newIngredient, ...prev]);
		} else {
			// Fallback: reload all ingredients if ingredient not provided
			loadIngredients();
		}
	};

	const handleDelete = async (id: string) => {
		if (
			confirm(
				"Are you sure you want to delete this ingredient? This will also remove it from any recipes."
			)
		) {
			// Optimistically remove from local state
			const previousIngredient = ingredients.find((i) => i.id === id);
			if (!previousIngredient) return;

			setIngredients((prev) =>
				prev.filter((ingredient) => ingredient.id !== id)
			);

			try {
				await storage.deleteIngredient(id);
			} catch (error) {
				// Revert on error
				setIngredients((prev) =>
					[...prev, previousIngredient].sort(
						(a, b) =>
							new Date(b.createdAt).getTime() -
							new Date(a.createdAt).getTime()
					)
				);
				console.error("Failed to delete ingredient:", error);
				alert("Failed to delete ingredient");
			}
		}
	};

	if (loading) {
		return (
			<div className="fixed inset-0 flex items-center justify-center z-40">
				<LoadingSpinner object="ingredients" />
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-0">
				<h1 className="heading-1">Ingredients</h1>
				<button
					className="btn-primary btn-full text-sm sm:text-base"
					onClick={() => setShowModal(true)}
				>
					+ Add Ingredient
				</button>
			</div>

			{ingredients.length === 0 ? (
				<div className="empty-state">
					<div className="empty-state-card">
						<h2 className="heading-2 mb-3 sm:mb-4">
							No ingredients yet
						</h2>
						<p className="text-primary-muted mb-4 sm:mb-6 text-sm sm:text-base">
							Add your first ingredient to get started! 🥕
						</p>
						<button
							className="btn-primary btn-full text-sm sm:text-base"
							onClick={() => setShowModal(true)}
						>
							Add Ingredient
						</button>
					</div>
				</div>
			) : (
				<div className="grid-responsive">
					{ingredients.map((ingredient) => (
						<div
							key={ingredient.id}
							className="card-small hover:shadow-xl hover:-translate-y-1 transition-all"
						>
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2">
								<div className="flex-1">
									<h2 className="text-xl sm:text-2xl font-bold text-primary mb-1">
										{ingredient.name}
									</h2>
									<p className="text-primary-muted text-xs sm:text-sm font-medium">
										Per 100g
									</p>
								</div>
								<button
									className="btn-danger btn-small self-start sm:self-auto"
									onClick={() => handleDelete(ingredient.id)}
								>
									Delete
								</button>
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
								{ingredient.macrosPerServing.calories !==
									undefined && (
									<div className="macro-card">
										<div className="macro-label">
											Calories
										</div>
										<div className="macro-value">
											{
												ingredient.macrosPerServing
													.calories
											}
										</div>
									</div>
								)}
								<div className="macro-card">
									<div className="macro-label">Protein</div>
									<div className="macro-value">
										{ingredient.macrosPerServing.protein}g
									</div>
								</div>
								<div className="macro-card">
									<div className="macro-label">Carbs</div>
									<div className="macro-value">
										{ingredient.macrosPerServing.carbs}g
									</div>
								</div>
								<div className="macro-card">
									<div className="macro-label">Fat</div>
									<div className="macro-value">
										{ingredient.macrosPerServing.fat}g
									</div>
								</div>
								{ingredient.macrosPerServing.fiber !==
									undefined && (
									<div className="macro-card">
										<div className="macro-label">Fiber</div>
										<div className="macro-value">
											{ingredient.macrosPerServing.fiber}g
										</div>
									</div>
								)}
								{ingredient.macrosPerServing.sugar !==
									undefined && (
									<div className="macro-card">
										<div className="macro-label">Sugar</div>
										<div className="macro-value">
											{ingredient.macrosPerServing.sugar}g
										</div>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			<IngredientModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				onSave={handleRefresh}
			/>
		</>
	);
}

export default function IngredientsPage() {
	return (
		<ProtectedRoute>
			<IngredientsPageContent />
		</ProtectedRoute>
	);
}
