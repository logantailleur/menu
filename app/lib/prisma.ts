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

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
