import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // Restrict to bitsom domain emails
            const email = user.email;
            if (!email) return false;

            // For now, allow all emails. Uncomment below to restrict:
            // const allowedDomain = "bitsom.edu.in";
            // if (!email.endsWith(`@${allowedDomain}`)) {
            //   return false;
            // }

            return true;
        },
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
                // Fetch role from database
                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { role: true, clubName: true },
                });
                if (dbUser) {
                    (session.user as any).role = dbUser.role;
                    (session.user as any).clubName = dbUser.clubName;
                }
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});
