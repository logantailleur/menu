import { Macro } from "../types/recipe";

interface MacrosDisplayProps {
	macros: Macro;
	servings: number;
}

export default function MacrosDisplay({
	macros,
	servings,
}: MacrosDisplayProps) {
	return (
		<div className="sidebar-card">
			<h2 className="heading-2">Recipe Macros</h2>
			<p className="text-sm text-primary-muted mb-4">
				Per {servings} {servings === 1 ? "serving" : "servings"}
			</p>

			<div className="space-y-3">
				{macros.calories !== undefined && (
					<div className="macro-card-large">
						<div className="macro-label">Calories</div>
						<div className="macro-value-large">{macros.calories}</div>
					</div>
				)}

				<div className="grid grid-cols-3 gap-2">
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
				</div>

				{((macros.fiber !== undefined && macros.fiber > 0) ||
					(macros.sugar !== undefined && macros.sugar > 0)) && (
					<div className="grid grid-cols-2 gap-2">
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
				)}
			</div>
		</div>
	);
}

