"use client";

import { FormEvent, useEffect, useState } from "react";
import { Ingredient, Macro } from "../types/recipe";
import { calculateCalories } from "../utils/calculations";
import { useStorage } from "../utils/storage-api";

interface IngredientModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (ingredient?: Ingredient) => void;
}

export default function IngredientModal({
	isOpen,
	onClose,
	onSave,
}: IngredientModalProps) {
	const storage = useStorage();
	const [formData, setFormData] = useState({
		name: "",
		protein: "",
		carbs: "",
		fat: "",
		fiber: "",
		sugar: "",
		calories: "", // Optional override
	});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			setFormData({
				name: "",
				protein: "",
				carbs: "",
				fat: "",
				fiber: "",
				sugar: "",
				calories: "",
			});
			setSaving(false);
		}
	}, [isOpen]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!formData.name.trim()) {
			alert("Please fill in ingredient name");
			return;
		}

		const protein = parseFloat(formData.protein) || 0;
		const carbs = parseFloat(formData.carbs) || 0;
		const fat = parseFloat(formData.fat) || 0;
		const fiber = parseFloat(formData.fiber) || 0;
		const sugar = parseFloat(formData.sugar) || 0;

		// Calculate calories from macros
		const calculatedCalories = calculateCalories(protein, carbs, fat);

		// Use override calories if provided, otherwise use calculated
		const calories = formData.calories.trim()
			? parseFloat(formData.calories)
			: calculatedCalories;

		const macros: Macro = {
			protein,
			carbs,
			fat,
			fiber,
			sugar,
		};

		// Only include calories if it's manually overridden
		if (formData.calories.trim()) {
			macros.calories = calories;
		}

		try {
			setSaving(true);
			const savedIngredient = await storage.saveIngredient({
				name: formData.name.trim(),
				macrosPerServing: macros,
			});

			onSave(savedIngredient);
			onClose();
		} catch (error) {
			console.error("Failed to save ingredient:", error);
			alert("Failed to save ingredient. Please try again.");
		} finally {
			setSaving(false);
		}
	};

	if (!isOpen) return null;

	const protein = parseFloat(formData.protein) || 0;
	const carbs = parseFloat(formData.carbs) || 0;
	const fat = parseFloat(formData.fat) || 0;
	const calculatedCalories = calculateCalories(protein, carbs, fat);
	const displayCalories = formData.calories.trim()
		? parseFloat(formData.calories)
		: calculatedCalories;

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<div className="p-4 sm:p-6 lg:p-8">
					<div className="modal-header">
						<h2 className="heading-2">Add New Ingredient 🥕</h2>
						<button
							onClick={onClose}
							className="close-button"
							aria-label="Close modal"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<form
						onSubmit={handleSubmit}
						className="space-y-4 sm:space-y-6"
					>
						<div>
							<label htmlFor="name" className="label">
								Ingredient Name{" "}
								<span className="required-asterisk">*</span>
							</label>
							<input
								type="text"
								id="name"
								value={formData.name}
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
								required
								className="input"
								placeholder="e.g., Chicken Breast"
							/>
						</div>

						<div>
							<h3 className="text-primary-muted font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
								Macros per 100g
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
								<div>
									<label
										htmlFor="protein"
										className="label text-xs sm:text-sm"
									>
										Protein (g){" "}
										<span className="required-asterisk">
											*
										</span>
									</label>
									<input
										type="number"
										id="protein"
										step="0.1"
										min="0"
										value={formData.protein}
										onChange={(e) =>
											setFormData({
												...formData,
												protein: e.target.value,
											})
										}
										required
										className="input"
										placeholder="0"
									/>
								</div>

								<div>
									<label
										htmlFor="carbs"
										className="label text-xs sm:text-sm"
									>
										Carbs (g){" "}
										<span className="required-asterisk">
											*
										</span>
									</label>
									<input
										type="number"
										id="carbs"
										step="0.1"
										min="0"
										value={formData.carbs}
										onChange={(e) =>
											setFormData({
												...formData,
												carbs: e.target.value,
											})
										}
										required
										className="input"
										placeholder="0"
									/>
								</div>

								<div>
									<label
										htmlFor="fat"
										className="label text-xs sm:text-sm"
									>
										Fat (g){" "}
										<span className="required-asterisk">
											*
										</span>
									</label>
									<input
										type="number"
										id="fat"
										step="0.1"
										min="0"
										value={formData.fat}
										onChange={(e) =>
											setFormData({
												...formData,
												fat: e.target.value,
											})
										}
										required
										className="input"
										placeholder="0"
									/>
								</div>

								<div>
									<label
										htmlFor="fiber"
										className="label text-xs sm:text-sm"
									>
										Fiber (g){" "}
										<span className="required-asterisk">
											*
										</span>
									</label>
									<input
										type="number"
										id="fiber"
										step="0.1"
										min="0"
										value={formData.fiber}
										onChange={(e) =>
											setFormData({
												...formData,
												fiber: e.target.value,
											})
										}
										required
										className="input"
										placeholder="0"
									/>
								</div>

								<div>
									<label
										htmlFor="sugar"
										className="label text-xs sm:text-sm"
									>
										Sugar (g){" "}
										<span className="required-asterisk">
											*
										</span>
									</label>
									<input
										type="number"
										id="sugar"
										step="0.1"
										min="0"
										value={formData.sugar}
										onChange={(e) =>
											setFormData({
												...formData,
												sugar: e.target.value,
											})
										}
										required
										className="input"
										placeholder="0"
									/>
								</div>

								<div>
									<label
										htmlFor="calories"
										className="label text-xs sm:text-sm"
									>
										Calories{" "}
										<span className="text-primary-muted text-xs">
											(Optional override)
										</span>
									</label>
									<div className="relative">
										<input
											type="number"
											id="calories"
											step="0.1"
											min="0"
											value={formData.calories}
											onChange={(e) =>
												setFormData({
													...formData,
													calories: e.target.value,
												})
											}
											className="input"
											placeholder={calculatedCalories.toString()}
										/>
										{!formData.calories.trim() && (
											<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary-muted">
												(calculated:{" "}
												{calculatedCalories})
											</span>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
							<button
								type="submit"
								className="btn-primary btn-full order-2 sm:order-1"
								disabled={saving}
							>
								{saving ? "Saving..." : "Save Ingredient ✨"}
							</button>
							<button
								type="button"
								onClick={onClose}
								className="btn-secondary btn-full order-1 sm:order-2"
								disabled={saving}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
