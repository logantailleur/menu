import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './supabase';
import { prisma } from './prisma';

export interface AuthenticatedUser {
	id: string;
	email: string;
}

/**
 * Authenticates the request and ensures the user exists in the database.
 * Returns the authenticated user or an error response.
 */
export async function authenticateRequest(
	request: NextRequest
): Promise<{ user: AuthenticatedUser; response: null } | { user: null; response: NextResponse }> {
	try {
		const authHeader = request.headers.get('authorization');
		if (!authHeader) {
			return {
				user: null,
				response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
			};
		}

		const token = authHeader.replace('Bearer ', '');
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser(token);

		if (error || !user) {
			return {
				user: null,
				response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
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
					email: user.email || '',
				},
			});
		}

		return {
			user: {
				id: user.id,
				email: user.email || '',
			},
			response: null,
		};
	} catch (error) {
		console.error('[API Auth] Error authenticating request:', error);
		return {
			user: null,
			response: NextResponse.json(
				{
					error: 'Internal server error',
					details: error instanceof Error ? error.message : String(error),
				},
				{ status: 500 }
			),
		};
	}
}

/**
 * Wrapper for API route handlers that require authentication.
 * Automatically handles authentication and passes the user to the handler.
 */
export function withAuth<T = any>(
	handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
) {
	return async (request: NextRequest) => {
		const authResult = await authenticateRequest(request);
		if (authResult.response) {
			return authResult.response;
		}
		return handler(request, authResult.user!);
	};
}

