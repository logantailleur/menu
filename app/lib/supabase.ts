import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
	if (supabaseClient) {
		return supabaseClient;
	}

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error("Missing Supabase environment variables");
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
