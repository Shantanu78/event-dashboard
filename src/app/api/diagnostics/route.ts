import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const steps = {
        envVars: "PENDING",
        dbConnection: "PENDING",
        userTable: "PENDING",
    };

    const details: any = {};

    try {
        // 1. Check Environment Variables
        const vars = ["DATABASE_URL", "AUTH_SECRET", "NEXTAUTH_URL"]; // NEXTAUTH_URL optional in Vercel
        const missing = vars.filter((v) => !process.env[v] && !process.env[`VERCEL_${v}`]); // Vercel might prefix, but usually not standard ones
        if (process.env.DATABASE_URL) {
            details.database_url_configured = "Yes";
            // Show masked URL for debugging (first 30 chars)
            const url = process.env.DATABASE_URL;
            details.database_url_preview = url.substring(0, 30) + "...";
            details.database_url_length = url.length;
            // Check if it's the pooled connection
            details.is_pooled = url.includes("pooler") ? "Yes" : "No";
            details.contains_neon = url.includes("neon") ? "Yes" : "No";
        } else {
            details.database_url_configured = "MISSING";
            details.database_url_preview = "N/A";
        }

        if (process.env.AUTH_SECRET) {
            details.auth_secret_configured = "Yes";
        } else {
            details.auth_secret_configured = "MISSING";
        }

        steps.envVars = "SUCCESS";

        // 2. Check DB Connection
        try {
            await prisma.$queryRaw`SELECT 1`;
            steps.dbConnection = "SUCCESS";
        } catch (e: any) {
            steps.dbConnection = "FAILED";
            details.dbConnectionError = e.message;
            throw new Error("Database Connection Failed");
        }

        // 3. Check for User Table (Schema Verification)
        try {
            const userCount = await prisma.user.count();
            steps.userTable = "SUCCESS";
            details.userCount = userCount;
        } catch (e: any) {
            steps.userTable = "FAILED";
            details.schemaError = e.message;
            details.hint = "Tables might be missing. Did you run 'npx prisma migrate deploy'?";
        }

        return NextResponse.json({ status: "ok", steps, details }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            {
                status: "error",
                message: error.message,
                steps,
                details
            },
            { status: 500 }
        );
    }
}
