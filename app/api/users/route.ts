import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "../../lib/api-auth";
import { prisma } from "../../lib/prisma";

// Create or update user in database
export const POST = withAuth(async (request: NextRequest, user) => {
	try {
		const existingUser = await prisma.user.findUnique({
			where: { id: user.id },
		});

		if (existingUser) {
			return NextResponse.json({ success: true, user: existingUser });
		}

		const newUser = await prisma.user.create({
			data: {
				id: user.id,
				email: user.email,
			},
		});

		return NextResponse.json({ success: true, user: newUser });
	} catch (error) {
		console.error("[/api/users] Error creating user:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
});
