import { NextRequest, NextResponse } from "next/server";
import { withAuth, createErrorResponse } from "../../lib/api-auth";
import { prisma } from "../../lib/prisma";

// Force dynamic rendering to prevent DB access during build
export const dynamic = "force-dynamic";

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
		return createErrorResponse(error);
	}
});
