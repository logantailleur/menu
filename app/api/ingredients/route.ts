import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { withAuth } from '../../lib/api-auth';

export const GET = withAuth(async (request: NextRequest, user) => {
	try {
		// Return only user's ingredients
		const ingredients = await prisma.ingredient.findMany({
			where: { userId: user.id },
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(ingredients);
	} catch (error) {
		console.error('[/api/ingredients] Error fetching ingredients:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
});

export const POST = withAuth(async (request: NextRequest, user) => {
	try {
		const body = await request.json();
		const { name, macrosPerServing } = body;

		const ingredient = await prisma.ingredient.create({
			data: {
				userId: user.id,
				name,
				calories: macrosPerServing.calories ?? null,
				protein: macrosPerServing.protein,
				carbs: macrosPerServing.carbs,
				fat: macrosPerServing.fat,
				fiber: macrosPerServing.fiber,
				sugar: macrosPerServing.sugar,
			},
		});

		return NextResponse.json(ingredient);
	} catch (error) {
		console.error('[/api/ingredients] Error creating ingredient:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
});

export const DELETE = withAuth(async (request: NextRequest, user) => {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ error: 'Missing id' }, { status: 400 });
		}

		await prisma.ingredient.deleteMany({
			where: { id, userId: user.id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('[/api/ingredients] Error deleting ingredient:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
});

