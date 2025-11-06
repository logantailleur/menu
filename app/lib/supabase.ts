import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
	if (supabaseClient) {
		return supabaseClient;
	}

	// In Next.js, client-side code needs NEXT_PUBLIC_ prefix
	// Server-side code can use variables without the prefix
	const supabaseUrl =
		process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
	const supabaseAnonKey =
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error(
			"Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file."
		);
	}

	supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
	return supabaseClient;
}

// Export a getter that initializes on first access
export const supabase = new Proxy({} as SupabaseClient, {
	get(_target, prop) {
		const client = getSupabaseClient();
		const value = client[prop as keyof SupabaseClient];
		if (typeof value === "function") {
			return value.bind(client);
		}
		return value;
	},
});
