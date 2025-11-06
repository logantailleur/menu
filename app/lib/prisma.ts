import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

// Validate DATABASE_URL is set
if (!process.env.DATABASE_URL) {
	throw new Error(
		"Missing DATABASE_URL environment variable. " +
			"Please set it in your environment variables. " +
			"For Vercel, add it in Project Settings > Environment Variables. " +
			"For Supabase, use the connection pooler URL from Settings > Database > Connection string (pooler mode)."
	);
}

// Ensure connection string has proper parameters for PgBouncer (Supabase connection pooler)
// This prevents "prepared statement already exists" errors
// pgbouncer=true: Tells Prisma to disable prepared statements (required for transaction pooling)
// connection_limit=1: Optimizes for serverless environments (Vercel)
let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl.includes("pooler.supabase.com")) {
	const url = new URL(databaseUrl);
	const params = url.searchParams;
	
	// Ensure pgbouncer=true is set (tells Prisma to disable prepared statements)
	if (!params.has("pgbouncer") || params.get("pgbouncer") !== "true") {
		params.set("pgbouncer", "true");
	}
	
	// Add connection_limit=1 for serverless optimization
	if (!params.has("connection_limit")) {
		params.set("connection_limit", "1");
	}
	
	// Reconstruct the URL
	url.search = params.toString();
	databaseUrl = url.toString();
}

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		datasources: {
			db: {
				url: databaseUrl,
			},
		},
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
