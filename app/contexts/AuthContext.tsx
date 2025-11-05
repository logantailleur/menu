"use client";

import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

interface AuthContextType {
	user: User | null;
	session: Session | null;
	loading: boolean;
	signUp: (email: string, password: string) => Promise<{ error: any }>;
	signIn: (email: string, password: string) => Promise<{ error: any }>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);
	const ensuredTokensRef = useRef<Set<string>>(new Set());

	const ensureUserInDatabase = async (accessToken: string) => {
		// Prevent duplicate calls for the same token
		if (ensuredTokensRef.current.has(accessToken)) {
			// console.log('[AuthContext] Skipping duplicate ensureUserInDatabase call for token');
			return;
		}

		ensuredTokensRef.current.add(accessToken);

		try {
			// console.log('[AuthContext] Calling /api/users to ensure user exists...');
			const response = await fetch("/api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error(
					"[AuthContext] Failed to ensure user record:",
					response.status,
					errorData
				);
				throw new Error(
					`Failed to create user: ${
						errorData.error || response.statusText
					}`
				);
			}

			const data = await response.json();
			// console.log(
			// 	"[AuthContext] User ensured:",
			// 	data.success,
			// 	data.user?.id
			// );
		} catch (err) {
			console.error("[AuthContext] Error ensuring user record:", err);
			// Remove from set on error so we can retry if needed
			ensuredTokensRef.current.delete(accessToken);
			// Don't fail - it will be created on first API call
		}
	};

	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);

			// Ensure user exists in database when session is available
			if (session?.access_token) {
				ensureUserInDatabase(session.access_token);
			}
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);

			// Ensure user exists in database when session is available
			// The ensuredTokensRef guard will prevent duplicate calls
			if (session?.access_token) {
				await ensureUserInDatabase(session.access_token);
			} else {
				// Clear ensured tokens when user signs out so new sign-ins can be processed
				ensuredTokensRef.current.clear();
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	const signUp = async (email: string, password: string) => {
		// console.log("[AuthContext] Signing up user:", email);
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			console.error("[AuthContext] Sign up error:", error);
			return { error };
		}

		// console.log(
		// 	"[AuthContext] Sign up successful, session:",
		// 	!!data.session
		// );

		// Create user record in database after successful sign up
		if (data.session?.access_token) {
			// console.log("[AuthContext] Creating user record after sign up...");
			try {
				await ensureUserInDatabase(data.session.access_token);
			} catch (err) {
				console.error(
					"[AuthContext] Failed to create user record after sign up:",
					err
				);
				// Don't fail sign up if user creation fails - it will be created on first API call
			}
		} else {
			console.warn(
				"[AuthContext] No session after sign up - user may need to confirm email"
			);
		}

		return { error };
	};

	const signIn = async (email: string, password: string) => {
		// console.log("[AuthContext] Signing in user:", email);
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error("[AuthContext] Sign in error:", error);
			return { error };
		}

		// console.log(
		// 	"[AuthContext] Sign in successful, ensuring user record..."
		// );

		// Ensure user record exists in database after successful sign in
		if (data.session?.access_token) {
			try {
				await ensureUserInDatabase(data.session.access_token);
			} catch (err) {
				console.error(
					"[AuthContext] Failed to ensure user record after sign in:",
					err
				);
				// Don't fail sign in if user creation fails - it will be created on first API call
			}
		} else {
			console.error("[AuthContext] No session after sign in");
		}

		return { error };
	};

	const signOut = async () => {
		await supabase.auth.signOut();
	};

	return (
		<AuthContext.Provider
			value={{ user, session, loading, signUp, signIn, signOut }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
