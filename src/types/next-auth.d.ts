import { RoleType } from "@/schema/inputTypeSchemas/RoleSchema";
import NextAuth, { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			role: RoleType;
			userReputation: number;
			id: string;
		} & DefaultSession["user"];
	}
	interface token {
		// id: string;
	}
}

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth/jwt" {
	interface JWT {
		/** The user's role. */
		role: RoleType;
		userReputation: number;
		id: string;
	}
}
