"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import IngredientModal from "../components/IngredientModal";
import ProtectedRoute from "../components/ProtectedRoute";
import { Ingredient, Macro, RecipeIngredient, Step } from "../types/recipe";
import { calculateMacrosFromIngredients } from "../utils/calculations";
import { useStorage } from "../utils/storage-api";

interface RecipeIngredientForm {
	ingredientId: string;
	quantity: number;
	unit: string;
	searchTerm: string;
	showSuggestions: boolean;
}

interface StepForm {
	stepNumber: number;
	instruction: string;
	duration?: number;
}

function AddRecipeContent() {
	const router = useRouter();
	const storage = useStorage();
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [servings, setServings] = useState(1);
	const [showIngredientModal, setShowIngredientModal] = useState(false);
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
	const [steps, setSteps] = useState<StepForm[]>([
		{ stepNumber: 1, instruction: "", duration: undefined },
	]);
	const searchRefs = useRef<(HTMLDivElement | null)[]>([]);
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

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			recipeIngredients.forEach((_, index) => {
				if (
					searchRefs.current[index] &&
					!searchRefs.current[index]?.contains(event.target as Node)
				) {
					const newIngredients = [...recipeIngredients];
					newIngredients[index].showSuggestions = false;
					setRecipeIngredients(newIngredients);
				}
			});
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [recipeIngredients]);

	const getFilteredIngredients = (searchTerm: string): Ingredient[] => {
		if (!searchTerm.trim()) return [];
		const term = searchTerm.toLowerCase();
		return ingredients.filter((ing) =>
			ing.name.toLowerCase().includes(term)
		);
	};

	const handleIngredientSearch = (index: number, searchTerm: string) => {
		const newIngredients = [...recipeIngredients];
		newIngredients[index].searchTerm = searchTerm;
		newIngredients[index].showSuggestions = true;
		if (!searchTerm.trim()) {
			newIngredients[index].ingredientId = "";
			newIngredients[index].unit = "";
		}
		setRecipeIngredients(newIngredients);
	};

	const handleSelectIngredient = (index: number, ingredient: Ingredient) => {
		const newIngredients = [...recipeIngredients];
		newIngredients[index].ingredientId = ingredient.id;
		newIngredients[index].searchTerm = ingredient.name;
		newIngredients[index].showSuggestions = false;
		newIngredients[index].unit = "g"; // Default to grams since all ingredients are per 100g
		setRecipeIngredients(newIngredients);
	};

	const handleQuantityChange = (index: number, quantity: number) => {
		const newIngredients = [...recipeIngredients];
		newIngredients[index].quantity = quantity;
		setRecipeIngredients(newIngredients);
	};

	const addRecipeIngredient = () => {
		setRecipeIngredients([
			...recipeIngredients,
			{
				ingredientId: "",
				quantity: 1,
				unit: "",
				searchTerm: "",
				showSuggestions: false,
			},
		]);
	};

	const removeRecipeIngredient = (index: number) => {
		if (recipeIngredients.length > 1) {
			setRecipeIngredients(
				recipeIngredients.filter((_, i) => i !== index)
			);
		}
	};

	const handleStepChange = (
		index: number,
		field: keyof StepForm,
		value: string | number | undefined
	) => {
		const newSteps = [...steps];
		newSteps[index] = {
			...newSteps[index],
			[field]: value,
		};
		setSteps(newSteps);
	};

	const addStep = () => {
		const nextStepNumber = steps.length + 1;
		setSteps([
			...steps,
			{
				stepNumber: nextStepNumber,
				instruction: "",
				duration: undefined,
			},
		]);
	};

	const removeStep = (index: number) => {
		if (steps.length > 1) {
			const newSteps = steps.filter((_, i) => i !== index);
			const renumberedSteps = newSteps.map((step, i) => ({
				...step,
				stepNumber: i + 1,
			}));
			setSteps(renumberedSteps);
		}
	};

	const handleRefreshIngredients = (newIngredient?: Ingredient) => {
		if (newIngredient) {
			// Optimistically add the new ingredient to local state
			setIngredients((prev) => [newIngredient, ...prev]);
		} else {
			// Fallback: reload all ingredients if ingredient not provided
			loadIngredients();
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const filteredRecipeIngredients = recipeIngredients.filter(
			(ri) => ri.ingredientId && ri.quantity > 0 && ri.unit.trim() !== ""
		);
		const filteredSteps = steps.filter((s) => s.instruction.trim() !== "");

		if (
			!name.trim() ||
			filteredRecipeIngredients.length === 0 ||
			filteredSteps.length === 0
		) {
			alert(
				"Please fill in all required fields (name, at least one ingredient, and at least one step)"
			);
			return;
		}

		if (servings <= 0) {
			alert("Servings must be greater than 0");
			return;
		}

		try {
			const recipeIngredientsData: Omit<
				RecipeIngredient,
				"id" | "createdAt"
			>[] = filteredRecipeIngredients.map((ri) => ({
				recipeId: "", // Will be set by the API
				ingredientId: ri.ingredientId,
				quantity: ri.quantity,
				unit: ri.unit.trim(),
			}));

			const stepsData: Omit<Step, "id" | "createdAt">[] =
				filteredSteps.map((step) => ({
					recipeId: "", // Will be set by the API
					stepNumber: step.stepNumber,
					instruction: step.instruction.trim(),
					duration: step.duration,
				}));

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
		<>
			<div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
				<div className="lg:w-80 lg:flex-shrink-0">
					<div className="sidebar-card">
						<h2 className="heading-2">Recipe Macros</h2>
						<p className="text-sm text-primary-muted mb-4">
							Per {servings}{" "}
							{servings === 1 ? "serving" : "servings"}
						</p>

						<div className="space-y-3">
							{currentMacros.calories !== undefined && (
								<div className="macro-card-large">
									<div className="macro-label">Calories</div>
									<div className="macro-value-large">
										{currentMacros.calories}
									</div>
								</div>
							)}

							<div className="grid grid-cols-3 gap-2">
								<div className="macro-card">
									<div className="macro-label">Protein</div>
									<div className="macro-value">
										{currentMacros.protein}g
									</div>
								</div>
								<div className="macro-card">
									<div className="macro-label">Carbs</div>
									<div className="macro-value">
										{currentMacros.carbs}g
									</div>
								</div>
								<div className="macro-card">
									<div className="macro-label">Fat</div>
									<div className="macro-value">
										{currentMacros.fat}g
									</div>
								</div>
							</div>

							{((currentMacros.fiber !== undefined &&
								currentMacros.fiber > 0) ||
								(currentMacros.sugar !== undefined &&
									currentMacros.sugar > 0)) && (
								<div className="grid grid-cols-2 gap-2">
									{currentMacros.fiber !== undefined &&
										currentMacros.fiber > 0 && (
											<div className="macro-card">
												<div className="macro-label">
													Fiber
												</div>
												<div className="macro-value">
													{currentMacros.fiber}g
												</div>
											</div>
										)}
									{currentMacros.sugar !== undefined &&
										currentMacros.sugar > 0 && (
											<div className="macro-card">
												<div className="macro-label">
													Sugar
												</div>
												<div className="macro-value">
													{currentMacros.sugar}g
												</div>
											</div>
										)}
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="flex-1">
					<div className="card-body">
						<h1 className="heading-2 mb-4 sm:mb-6">
							Add New Recipe 🍳
						</h1>

						<form
							onSubmit={handleSubmit}
							className="space-y-4 sm:space-y-6"
						>
							<div>
								<label htmlFor="name" className="label">
									Recipe Name{" "}
									<span className="required-asterisk">*</span>
								</label>
								<input
									type="text"
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									className="input"
									placeholder="e.g., Chocolate Chip Cookies"
								/>
							</div>

							<div>
								<label htmlFor="description" className="label">
									Description
								</label>
								<textarea
									id="description"
									value={description}
									onChange={(e) =>
										setDescription(e.target.value)
									}
									rows={3}
									className="textarea"
									placeholder="A delicious recipe for..."
								/>
							</div>

							<div>
								<label htmlFor="servings" className="label">
									Servings{" "}
									<span className="required-asterisk">*</span>
								</label>
								<input
									type="number"
									id="servings"
									min="1"
									value={servings}
									onChange={(e) =>
										setServings(
											parseInt(e.target.value) || 1
										)
									}
									required
									className="input"
								/>
							</div>

							<div>
								<label className="label">
									Ingredients{" "}
									<span className="required-asterisk">*</span>
								</label>
								<p className="text-primary-muted text-xs sm:text-sm mb-3 sm:mb-4">
									Search for ingredients. Ingredients are
									stored per 100g. Select the unit you want to
									use in this recipe.
								</p>
								<div className="space-y-3">
									{recipeIngredients.map((ri, index) => {
										const filtered = getFilteredIngredients(
											ri.searchTerm
										);
										return (
											<div
												key={index}
												className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start"
												ref={(el) => {
													searchRefs.current[index] =
														el;
												}}
											>
												<div className="flex-1 sm:flex-2 w-full relative">
													<input
														type="text"
														value={ri.searchTerm}
														onChange={(e) =>
															handleIngredientSearch(
																index,
																e.target.value
															)
														}
														onFocus={() => {
															const newIngredients =
																[
																	...recipeIngredients,
																];
															newIngredients[
																index
															].showSuggestions =
																true;
															setRecipeIngredients(
																newIngredients
															);
														}}
														placeholder="Search ingredient..."
														required={index === 0}
														className="input"
													/>
													{ri.showSuggestions &&
														filtered.length > 0 && (
															<div className="search-dropdown">
																{filtered.map(
																	(ing) => {
																		return (
																			<button
																				key={
																					ing.id
																				}
																				type="button"
																				onClick={() =>
																					handleSelectIngredient(
																						index,
																						ing
																					)
																				}
																				className="search-item"
																			>
																				<div className="search-item-name">
																					{
																						ing.name
																					}
																				</div>
																				<div className="search-item-meta">
																					(per
																					100g)
																				</div>
																			</button>
																		);
																	}
																)}
															</div>
														)}
													{ri.showSuggestions &&
														ri.searchTerm.trim() &&
														filtered.length ===
															0 && (
															<div className="search-empty">
																<p className="text-sm text-primary-muted mb-2">
																	No
																	ingredients
																	found
																</p>
																<button
																	type="button"
																	onClick={() =>
																		setShowIngredientModal(
																			true
																		)
																	}
																	className="text-sm text-secondary-dark font-medium hover:underline"
																>
																	+ Create new
																	ingredient
																</button>
															</div>
														)}
												</div>

												<input
													type="number"
													step="0.1"
													min="0"
													value={ri.quantity}
													onChange={(e) =>
														handleQuantityChange(
															index,
															parseFloat(
																e.target.value
															) || 0
														)
													}
													placeholder="Qty"
													required
													className="input flex-1 w-full sm:w-auto"
												/>

												<div className="input-disabled flex-1 w-full sm:w-auto">
													{ri.unit || "—"}
												</div>

												{recipeIngredients.length >
													1 && (
													<button
														type="button"
														className="btn-danger btn-full"
														onClick={() =>
															removeRecipeIngredient(
																index
															)
														}
													>
														Remove
													</button>
												)}
											</div>
										);
									})}
									<div className="flex gap-2">
										<button
											type="button"
											className="btn-secondary btn-full text-sm sm:text-base"
											onClick={addRecipeIngredient}
										>
											+ Add Ingredient
										</button>
										<button
											type="button"
											className="btn-secondary bg-secondary-light hover:bg-secondary-hover text-secondary-dark border-action-300 dark:border-action-500/40 hover:border-action-400 dark:hover:border-action-500/60 btn-full text-sm sm:text-base"
											onClick={() =>
												setShowIngredientModal(true)
											}
										>
											+ New Ingredient
										</button>
									</div>
								</div>
							</div>

							<div>
								<label className="label">
									Steps{" "}
									<span className="required-asterisk">*</span>
								</label>
								<div className="space-y-3 sm:space-y-4">
									{steps.map((step, index) => (
										<div key={index} className="step-card">
											<div className="flex gap-2 sm:gap-3 items-start mb-2 sm:mb-3">
												<span className="step-number">
													{step.stepNumber}
												</span>
												<textarea
													value={step.instruction}
													onChange={(e) =>
														handleStepChange(
															index,
															"instruction",
															e.target.value
														)
													}
													placeholder="Enter instruction..."
													required
													rows={2}
													className="textarea flex-1 px-3 sm:px-4 py-2 sm:py-3"
												/>
												{steps.length > 1 && (
													<button
														type="button"
														className="btn-danger btn-small flex-shrink-0"
														onClick={() =>
															removeStep(index)
														}
													>
														Remove
													</button>
												)}
											</div>
											<div className="ml-9 sm:ml-11">
												<label className="text-primary-muted text-xs sm:text-sm">
													Duration (minutes,
													optional):
													<input
														type="number"
														min="0"
														step="0.5"
														value={
															step.duration || ""
														}
														onChange={(e) =>
															handleStepChange(
																index,
																"duration",
																e.target.value
																	? parseFloat(
																			e
																				.target
																				.value
																	  )
																	: undefined
															)
														}
														className="input ml-2 w-20 sm:w-24 text-base px-3 py-2"
														placeholder="e.g., 15"
													/>
												</label>
											</div>
										</div>
									))}
									<button
										type="button"
										className="btn-secondary btn-full text-sm sm:text-base"
										onClick={addStep}
									>
										+ Add Step
									</button>
								</div>
							</div>

							<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
								<button
									type="submit"
									className="btn-primary btn-full order-2 sm:order-1"
								>
									Save Recipe ✨
								</button>
								<Link href="/" className="order-1 sm:order-2">
									<button
										type="button"
										className="btn-secondary btn-full"
									>
										Cancel
									</button>
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>

			<IngredientModal
				isOpen={showIngredientModal}
				onClose={() => setShowIngredientModal(false)}
				onSave={handleRefreshIngredients}
			/>
		</>
	);
}

export default function AddRecipe() {
	return (
		<ProtectedRoute>
			<AddRecipeContent />
		</ProtectedRoute>
	);
}
