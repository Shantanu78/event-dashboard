import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Simplified auth config without database for demo deployment
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || "demo",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo",
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            // Allow all emails for now
            return true;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});
