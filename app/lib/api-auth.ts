import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";
import { supabase } from "./supabase";

export interface AuthenticatedUser {
	id: string;
	email: string;
}

/**
 * Checks if an error is a database connection error
 */
export function isDatabaseError(error: unknown): boolean {
	const errorMessage = error instanceof Error ? error.message : String(error);
	return (
		errorMessage.includes("Tenant or user not found") ||
		errorMessage.includes("FATAL") ||
		errorMessage.includes("DATABASE_URL") ||
		errorMessage.includes("connection")
	);
}

/**
 * Creates a standardized error response with helpful hints for database errors
 */
export function createErrorResponse(error: unknown, status: number = 500) {
	const errorMessage = error instanceof Error ? error.message : String(error);
	const dbError = isDatabaseError(error);
	
	return NextResponse.json(
		{
			error: "Internal server error",
			details: errorMessage,
			...(dbError && {
				hint: "This looks like a database connection issue. Please check that DATABASE_URL is set correctly in your Vercel environment variables."
			}),
		},
		{ status }
	);
}

/**
 * Authenticates the request and ensures the user exists in the database.
 * Returns the authenticated user or an error response.
 */
export async function authenticateRequest(
	request: NextRequest
): Promise<
	| { user: AuthenticatedUser; response: null }
	| { user: null; response: NextResponse }
> {
	try {
		const authHeader = request.headers.get("authorization");
		if (!authHeader) {
			return {
				user: null,
				response: NextResponse.json(
					{ error: "Unauthorized" },
					{ status: 401 }
				),
			};
		}

		const token = authHeader.replace("Bearer ", "");
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser(token);

		if (error || !user) {
			return {
				user: null,
				response: NextResponse.json(
					{ error: "Unauthorized" },
					{ status: 401 }
				),
			};
		}

		// Ensure user exists in database
		const existingUser = await prisma.user.findUnique({
			where: { id: user.id },
		});

		if (!existingUser) {
			await prisma.user.create({
				data: {
					id: user.id,
					email: user.email || "",
				},
			});
		}

		return {
			user: {
				id: user.id,
				email: user.email || "",
			},
			response: null,
		};
	} catch (error) {
		console.error("[API Auth] Error authenticating request:", error);
		return {
			user: null,
			response: createErrorResponse(error),
		};
	}
}

/**
 * Wrapper for API route handlers that require authentication.
 * Automatically handles authentication and passes the user to the handler.
 */
export function withAuth<T = any>(
	handler: (
		request: NextRequest,
		user: AuthenticatedUser
	) => Promise<NextResponse>
) {
	return async (request: NextRequest) => {
		const authResult = await authenticateRequest(request);
		if (authResult.response) {
			return authResult.response;
		}
		return handler(request, authResult.user!);
	};
}
