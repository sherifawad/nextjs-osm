import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUser, isUserAccountBlocked } from "@/data-access";
import { prismaDb } from "@/prisma";
import { AuthOptions } from "next-auth";
import { env } from "process";

export const authOptions = {
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prismaDb),
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
    async signIn({ account }) {
      if (account) {
        const result = await isUserAccountBlocked({
          provider: account?.provider,
          providerAccountId: account?.providerAccountId,
        });
        if (result.status === "success") return !result.data;
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await getUser({ id: user.id });
        if (dbUser.status === "success") {
          return {
            ...token,
            id: user.id,
            role: dbUser.data.role,
            userReputation: dbUser.data.userReputation,
          };
        }
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          userReputation: token.userReputation,
          role: token.role,
        },
      };
    },
  },
} satisfies AuthOptions;
