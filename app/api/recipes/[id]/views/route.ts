import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// Force dynamic rendering to prevent DB access during build
export const dynamic = "force-dynamic";

// Increment recipe views (only for public recipes, no authentication required)
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		// Check if recipe exists and is public
		const recipe = await prisma.recipe.findUnique({
			where: { id },
		});

		if (!recipe) {
			return NextResponse.json(
				{ error: "Recipe not found" },
				{ status: 404 }
			);
		}

		if (!recipe.isPublic) {
			return NextResponse.json(
				{ error: "Recipe is not public" },
				{ status: 403 }
			);
		}

		const updatedRecipe = await prisma.recipe.update({
			where: { id },
			data: {
				views: {
					increment: 1,
				},
			},
		});

		return NextResponse.json({ success: true, views: updatedRecipe.views });
	} catch (error) {
		console.error(
			"[/api/recipes/[id]/views] Error incrementing views:",
			error
		);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
