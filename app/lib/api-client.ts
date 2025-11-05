"use client";

import { useAuth } from '../contexts/AuthContext';

export interface ApiError {
	error: string;
	details?: string;
}

// Shared request cache across all instances
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Unified API client helper for making authenticated API calls.
 * Automatically handles authentication headers and error handling.
 * Includes request deduplication to prevent duplicate simultaneous requests.
 */
export function useApiClient() {
	const { session } = useAuth();

	const getAuthHeaders = (): HeadersInit => {
		if (!session?.access_token) {
			throw new Error('Not authenticated');
		}
		return {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session.access_token}`,
		};
	};

	const request = async <T = any>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> => {
		if (!session?.access_token) {
			throw new Error('Not authenticated');
		}

		// Create a unique key for this request
		const requestKey = `${options.method || 'GET'}:${endpoint}${options.body ? `:${options.body}` : ''}`;
		
		// Check if there's already a pending request for this exact call
		const pendingRequest = pendingRequests.get(requestKey);
		if (pendingRequest) {
			return pendingRequest;
		}

		// Create the request promise
		const requestPromise = (async () => {
			try {
				const response = await fetch(endpoint, {
					...options,
					headers: {
						...getAuthHeaders(),
						...options.headers,
					},
				});

				if (!response.ok) {
					const errorData: ApiError = await response.json().catch(() => ({
						error: 'Request failed',
					}));
					throw new Error(errorData.error || `Request failed with status ${response.status}`);
				}

				return response.json();
			} finally {
				// Remove from pending requests once complete
				pendingRequests.delete(requestKey);
			}
		})();

		// Store the pending request
		pendingRequests.set(requestKey, requestPromise);

		return requestPromise as Promise<T>;
	};

	return {
		get: <T = any>(endpoint: string): Promise<T> =>
			request<T>(endpoint, { method: 'GET' }),
		post: <T = any>(endpoint: string, data?: any): Promise<T> =>
			request<T>(endpoint, {
				method: 'POST',
				body: data ? JSON.stringify(data) : undefined,
			}),
		patch: <T = any>(endpoint: string, data?: any): Promise<T> =>
			request<T>(endpoint, {
				method: 'PATCH',
				body: data ? JSON.stringify(data) : undefined,
			}),
		delete: <T = any>(endpoint: string): Promise<T> =>
			request<T>(endpoint, { method: 'DELETE' }),
	};
}

