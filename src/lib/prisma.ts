import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
    const connectionString = process.env.DATABASE_URL;

    // Enhanced debug logging for Vercel
    console.log("=== PRISMA CLIENT INITIALIZATION ===");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("DATABASE_URL exists:", !!connectionString);
    console.log("DATABASE_URL length:", connectionString?.length ?? 0);
    console.log("DATABASE_URL preview:", connectionString?.substring(0, 50) + "...");
    console.log("Contains 'neon':", connectionString?.includes("neon") ?? false);
    console.log("Contains 'pooler':", connectionString?.includes("pooler") ?? false);
    console.log("=====================================");

    if (!connectionString) {
        throw new Error("DATABASE_URL environment variable is not set");
    }

    // Explicitly pass the connection string to override any build-time defaults
    return new PrismaClient({
        datasources: {
            db: {
                url: connectionString,
            },
        },
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
