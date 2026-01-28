import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    const steps = {
        envVars: "PENDING",
        dbConnection: "PENDING",
        userTable: "PENDING",
    };

    const details: Record<string, unknown> = {};

    try {
        // 1. Check Environment Variables
        const databaseUrl = process.env.DATABASE_URL;
        const authSecret = process.env.AUTH_SECRET;

        if (databaseUrl) {
            details.database_url_configured = "Yes";
            details.database_url_preview = databaseUrl.substring(0, 50) + "...";
            details.database_url_length = databaseUrl.length;
            details.is_pooled = databaseUrl.includes("pooler") ? "Yes" : "No";
            details.contains_neon = databaseUrl.includes("neon") ? "Yes" : "No";
            details.contains_green_river = databaseUrl.includes("green-river") ? "Yes" : "No";
        } else {
            details.database_url_configured = "MISSING";
            details.database_url_preview = "N/A";
        }

        details.auth_secret_configured = authSecret ? "Yes" : "MISSING";
        details.node_env = process.env.NODE_ENV;

        steps.envVars = "SUCCESS";

        // 2. Check DB Connection
        try {
            const result = await prisma.$queryRaw`SELECT 1 as test`;
            steps.dbConnection = "SUCCESS";
            details.dbQueryResult = result;
        } catch (e: unknown) {
            steps.dbConnection = "FAILED";
            const error = e as Error;
            details.dbConnectionError = error.message;
            throw new Error("Database Connection Failed");
        }

        // 3. Check for User Table (Schema Verification)
        try {
            const userCount = await prisma.user.count();
            steps.userTable = "SUCCESS";
            details.userCount = userCount;
        } catch (e: unknown) {
            steps.userTable = "FAILED";
            const error = e as Error;
            details.schemaError = error.message;
            details.hint = "Tables might be missing. Run 'npx prisma migrate deploy' with production DATABASE_URL.";
        }

        return NextResponse.json({ status: "ok", steps, details }, { status: 200 });

    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json(
            {
                status: "error",
                message: err.message,
                steps,
                details
            },
            { status: 500 }
        );
    }
}
