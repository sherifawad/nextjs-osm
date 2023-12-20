import { RoleType } from "@/schema/inputTypeSchemas/RoleSchema";
import NextAuth, { DefaultSession, Account as DefaultAccount } from "next-auth";
import "next-auth/jwt";
import "next-auth/adapters";
import { User } from "../../types";
import type { Account as PrismaAccount } from "prisma/prisma-client";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends Omit<DefaultSession, "user"> {
    user: User;
  }
  interface token {
    // id: string;
  }
  // interface Account extends PrismaAccount {}

  // interface Account extends PrismaAccount {}
  // interface CallbacksOptions<P extends Record<string, unknown> = Profile, A extends Record<string, unknown> = Account> {
  // 	signIn: (params: {
  // 		user: User | AdapterUser;
  // 		account: A | null;
  // 		profile?: P;
  // 		email?: {
  // 			verificationRequest?: boolean;
  // 		};
  // 		credentials?: Record<string, CredentialInput>;
  // 	}) => Awaitable<boolean>;
  // }
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

// declare module "next-auth/core" {
// 	interface Account extends PrismaAccount {}
// 	interface CallbacksOptions<P extends Record<string, unknown> = Profile, A extends Record<string, unknown> = Account> {
// 		signIn: (params: {
// 			user: User | AdapterUser;
// 			account: A | null;
// 			profile?: P;
// 			email?: {
// 				verificationRequest?: boolean;
// 			};
// 			credentials?: Record<string, CredentialInput>;
// 		}) => Awaitable<boolean>;
// 	}
// }
