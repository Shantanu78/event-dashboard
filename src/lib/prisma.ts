import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
    // Debug logging for Vercel deployment
    if (process.env.NODE_ENV === 'production') {
        const url = process.env.DATABASE_URL;
        console.log("Prisma Client Initializing...");
        console.log("DATABASE_URL Configured:", !!url);
        console.log("DATABASE_URL Starts with:", url?.substring(0, 15));
    }
    return new PrismaClient();
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
