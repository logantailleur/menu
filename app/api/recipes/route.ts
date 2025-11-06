import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { withAuth, createErrorResponse } from '../../lib/api-auth';

// Force dynamic rendering to prevent DB access during build
export const dynamic = "force-dynamic";

export const GET = withAuth(async (request: NextRequest, user) => {
	try {
		const recipes = await prisma.recipe.findMany({
			where: { userId: user.id },
			include: {
				recipeIngredients: {
					include: {
						ingredient: true,
					},
				},
				steps: {
					orderBy: { stepNumber: 'asc' },
				},
			},
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(recipes);
	} catch (error) {
		console.error('[/api/recipes] Error fetching recipes:', error);
		return createErrorResponse(error);
	}
});

export const POST = withAuth(async (request: NextRequest, user) => {
	try {
		const body = await request.json();
		const { name, description, servings, ingredients, steps } = body;

		const recipe = await prisma.recipe.create({
			data: {
				userId: user.id,
				name,
				description: description || null,
				servings,
				recipeIngredients: {
					create: ingredients.map((ri: any) => ({
						userId: user.id,
						ingredientId: ri.ingredientId,
						quantity: ri.quantity,
						unit: ri.unit,
					})),
				},
				steps: {
					create: steps.map((step: any) => ({
						userId: user.id,
						stepNumber: step.stepNumber,
						instruction: step.instruction,
						duration: step.duration || null,
					})),
				},
			},
			include: {
				recipeIngredients: {
					include: {
						ingredient: true,
					},
				},
				steps: {
					orderBy: { stepNumber: 'asc' },
				},
			},
		});

		return NextResponse.json(recipe);
	} catch (error) {
		console.error('[/api/recipes] Error creating recipe:', error);
		return createErrorResponse(error);
	}
});

export const DELETE = withAuth(async (request: NextRequest, user) => {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ error: 'Missing id' }, { status: 400 });
		}

		await prisma.recipe.deleteMany({
			where: { id, userId: user.id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('[/api/recipes] Error deleting recipe:', error);
		return createErrorResponse(error);
	}
});

export const PATCH = withAuth(async (request: NextRequest, user) => {
	try {
		const body = await request.json();
		const { id, isPublic } = body;

		if (!id || typeof isPublic !== 'boolean') {
			return NextResponse.json(
				{ error: 'Missing id or isPublic' },
				{ status: 400 }
			);
		}

		const recipe = await prisma.recipe.updateMany({
			where: { id, userId: user.id },
			data: { isPublic },
		});

		if (recipe.count === 0) {
			return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('[/api/recipes] Error updating recipe:', error);
		return createErrorResponse(error);
	}
});

