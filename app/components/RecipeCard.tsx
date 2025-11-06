import { Clock, Eye, Globe, Lock, Trash2 } from "lucide-react";
import { Macro, Recipe } from "../types/recipe";

interface RecipeIngredient {
	id: string;
	ingredientId: string;
	quantity: number;
	unit: string;
}

interface RecipeStep {
	id: string;
	stepNumber: number;
	instruction: string;
	duration?: number | null;
}

interface RecipeCardProps {
	recipe: Recipe;
	macros: Macro;
	recipeIngredients: RecipeIngredient[];
	steps: RecipeStep[];
	getIngredientName: (ingredientId: string) => string;
	onClick?: () => void;
	onDelete?: (recipeId: string) => void;
	onTogglePublic?: (recipeId: string, isPublic: boolean) => void;
	showAuthor?: boolean;
	authorEmail?: string;
}

export default function RecipeCard({
	recipe,
	macros,
	recipeIngredients,
	steps,
	getIngredientName,
	onClick,
	onDelete,
	onTogglePublic,
	showAuthor = false,
	authorEmail,
}: RecipeCardProps) {
	const cardClasses = `card-small hover:shadow-xl hover:-translate-y-1 transition-all${
		onClick ? " cursor-pointer" : ""
	}`;

	return (
		<div className={cardClasses} onClick={onClick}>
			{(onDelete || onTogglePublic) && (
				<div className="flex justify-between items-center w-full mb-4 gap-3">
					{onTogglePublic && (
						<button
							className={`btn-secondary btn-small flex items-center gap-1.5 ${
								recipe.isPublic
									? "bg-secondary border-secondary text-primary"
									: ""
							}`}
							onClick={(e) => {
								e.stopPropagation();
								onTogglePublic(recipe.id, !recipe.isPublic);
							}}
							title={
								recipe.isPublic ? "Make private" : "Make public"
							}
						>
							{recipe.isPublic ? (
								<Globe className="w-4 h-4" />
							) : (
								<Lock className="w-4 h-4" />
							)}
							<span>
								{recipe.isPublic ? "Public" : "Private"}
							</span>
						</button>
					)}
					{onDelete && (
						<button
							className="btn-danger btn-small ml-auto flex items-center gap-1.5"
							onClick={(e) => {
								e.stopPropagation();
								onDelete(recipe.id);
							}}
						>
							<Trash2 className="w-4 h-4" />
							<span>Delete</span>
						</button>
					)}
				</div>
			)}
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
						{recipe.isPublic && (
							<>
								<span>•</span>
								<span className="text-secondary">Public</span>
							</>
						)}
						{showAuthor && authorEmail && (
							<>
								<span>•</span>
								<span>By: {authorEmail}</span>
							</>
						)}
						{recipe.views !== undefined && recipe.views > 0 && (
							<>
								<span>•</span>
								<span className="flex items-center gap-1">
									<Eye className="w-3.5 h-3.5" />
									{recipe.views}{" "}
									{recipe.views === 1 ? "view" : "views"}
								</span>
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
					{recipeIngredients.map((ri) => {
						const ingredientName = getIngredientName(
							ri.ingredientId
						);
						return (
							<li
								key={ri.id}
								className="text-primary-muted text-xs sm:text-sm flex items-start"
							>
								<span className="text-secondary mr-2">•</span>
								<span>
									{ri.quantity}
									{ri.unit} {ingredientName}
								</span>
							</li>
						);
					})}
				</ul>
			</div>

			<div>
				<h3 className="heading-3">Steps</h3>
				<div className="space-y-2.5 sm:space-y-3">
					{steps.map((step) => (
						<div key={step.id} className="step-card">
							<div className="flex items-start gap-3 sm:gap-4">
								<span className="step-number">
									{step.stepNumber}
								</span>
								<div className="flex-1 min-w-0">
									<p className="text-primary text-xs sm:text-sm leading-relaxed">
										{step.instruction}
									</p>
									{step.duration && (
										<div className="inline-flex items-center gap-1.5 mt-2 px-2 py-1 bg-secondary-light rounded-lg border border-secondary/30">
											<Clock className="w-3.5 h-3.5 text-primary-muted" />
											<span className="text-primary-muted text-xs font-medium">
												{step.duration} min
											</span>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
