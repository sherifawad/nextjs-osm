import { env } from "@/env";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./prisma";
import { Session } from "inspector";

export const authOptions: AuthOptions = {
    secret: env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
    },

    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const dbUser = await db.user.findUnique({
                    where: {
                        id: user.id,
                    },
                });
                if (dbUser) {
                    return {
                        ...token,
                        id: user.id,
                        role: dbUser.role,
                        reputation: dbUser.reputation,
                    };
                }
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    reputation: token.reputation,
                    role: token.role,
                },
            };
        },
    },
};
