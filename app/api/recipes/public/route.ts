import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { createErrorResponse } from "../../../lib/api-auth";

// Force dynamic rendering to prevent DB access during build
export const dynamic = "force-dynamic";

// Get all public recipes (no authentication required)
export async function GET(request: NextRequest) {
	try {
		const recipes = await prisma.recipe.findMany({
			where: { isPublic: true },
			include: {
				recipeIngredients: {
					include: {
						ingredient: true,
					},
				},
				steps: {
					orderBy: { stepNumber: "asc" },
				},
				user: {
					select: {
						email: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(recipes);
	} catch (error) {
		console.error(
			"[/api/recipes/public] Error fetching public recipes:",
			error
		);
		return createErrorResponse(error);
	}
}
