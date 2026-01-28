import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const details: Record<string, unknown> = {};

    // List ALL database-related environment variables
    const envVars = Object.keys(process.env).filter(key =>
        key.includes("DATABASE") ||
        key.includes("POSTGRES") ||
        key.includes("NEON") ||
        key.includes("DB_") ||
        key.includes("AUTH")
    );

    details.all_db_env_vars = envVars;

    // Show each one (masked)
    for (const key of envVars) {
        const val = process.env[key];
        if (val) {
            details[`env_${key}`] = val.substring(0, 40) + "... (len:" + val.length + ")";
        }
    }

    // Check specific variables
    const databaseUrl = process.env.DATABASE_URL;
    const postgresUrl = process.env.POSTGRES_URL;
    const postgresPrismaUrl = process.env.POSTGRES_PRISMA_URL;

    details.DATABASE_URL_exists = !!databaseUrl;
    details.POSTGRES_URL_exists = !!postgresUrl;
    details.POSTGRES_PRISMA_URL_exists = !!postgresPrismaUrl;

    if (databaseUrl) {
        details.DATABASE_URL_preview = databaseUrl.substring(0, 50) + "...";
        details.DATABASE_URL_length = databaseUrl.length;
        details.DATABASE_URL_contains_neon = databaseUrl.includes("neon");
        details.DATABASE_URL_contains_fake = databaseUrl.includes("fake");
    }

    // Try to connect using the URL we find
    let connectionUrl = databaseUrl || postgresUrl || postgresPrismaUrl;
    details.using_connection_from = databaseUrl ? "DATABASE_URL" : postgresUrl ? "POSTGRES_URL" : postgresPrismaUrl ? "POSTGRES_PRISMA_URL" : "NONE";

    if (!connectionUrl) {
        return NextResponse.json({
            status: "error",
            message: "No database URL found in any environment variable",
            details
        }, { status: 500 });
    }

    // Try database connection
    try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: connectionUrl,
                },
            },
        });

        await prisma.$queryRaw`SELECT 1 as test`;
        await prisma.$disconnect();

        details.connection = "SUCCESS";

        return NextResponse.json({
            status: "ok",
            message: "Database connection successful!",
            details
        }, { status: 200 });

    } catch (error: unknown) {
        const err = error as Error;
        details.connection = "FAILED";
        details.error = err.message;

        return NextResponse.json({
            status: "error",
            message: "Database connection failed",
            details
        }, { status: 500 });
    }
}
