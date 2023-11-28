import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { env } from "@/env";
import { getUser } from "@/database";
import { prismaDb } from "@/prisma";

export const authOptions: AuthOptions = {
	secret: env.NEXTAUTH_SECRET || "",
	adapter: PrismaAdapter(prismaDb),
	session: {
		strategy: "jwt",
	},

	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID || "",
			clientSecret: env.GOOGLE_CLIENT_SECRET || "",
		}),
	],
	callbacks: {
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
		async session({ session, token }) {
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
};
